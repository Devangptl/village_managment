import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const familyName = searchParams.get('family');

    if (!familyName) {
      return NextResponse.json({ success: false, error: 'Family name is required' }, { status: 400 });
    }

    // 0. Fetch the single root mode setting
    const settingResult = await query(
      "SELECT data_value FROM village_data WHERE data_key = 'family_tree_single_root'"
    );
    const singleRootMode = settingResult.length > 0 && settingResult[0].data_value === 'true';

    // 1. Fetch all active people in this family
    const people = await query(
      'SELECT id, name, photo, gender, birth_date, death_date, family_name, phone, occupation, bio FROM people WHERE is_active = 1 AND family_name = ?',
      [familyName]
    );

    if (people.length === 0) {
      return NextResponse.json({
        success: true,
        data: { tree: [], people: [], connections: { parents: {}, children: {}, spouses: {} } }
      });
    }

    const peopleIds = people.map(p => p.id);

    // 2. Fetch all relationships involving these people
    const placeholders = peopleIds.map(() => '?').join(',');
    const relationships = await query(
      'SELECT person_id, related_person_id, relationship_type FROM relationships WHERE person_id IN (' + placeholders + ') OR related_person_id IN (' + placeholders + ')',
      [...peopleIds, ...peopleIds]
    );

    // 3. Also fetch any people (spouses from other families) linked via relationships
    const relatedPersonIds = new Set();
    relationships.forEach(r => {
      if (!peopleIds.includes(r.person_id)) relatedPersonIds.add(r.person_id);
      if (!peopleIds.includes(r.related_person_id)) relatedPersonIds.add(r.related_person_id);
    });

    if (relatedPersonIds.size > 0) {
      const extraIds = Array.from(relatedPersonIds);
      const extraPlaceholders = extraIds.map(() => '?').join(',');
      const extraPeople = await query(
        'SELECT id, name, photo, gender, birth_date, death_date, family_name, phone, occupation, bio FROM people WHERE id IN (' + extraPlaceholders + ')',
        extraIds
      );
      people.push(...extraPeople);
      extraPeople.forEach(ep => peopleIds.push(ep.id));
    }

    // 4. Format dates and build people map
    const formattedPeople = people.map(p => ({
      ...p,
      birth_date: p.birth_date ? new Date(p.birth_date).toISOString().split('T')[0] : null,
      birth_year: p.birth_date ? new Date(p.birth_date).getFullYear() : null,
      death_date: p.death_date ? new Date(p.death_date).toISOString().split('T')[0] : null,
    }));

    const peopleMap = new Map(formattedPeople.map(p => [p.id, { ...p, childIds: [], spouseIds: [], parentIds: [] }]));

    // 5. Process relationships
    // relationship_type: 'child' means person_id is parent of related_person_id
    // relationship_type: 'spouse' means person_id is spouse of related_person_id
    // relationship_type: 'father'/'mother' means person_id has father/mother = related_person_id
    relationships.forEach(rel => {
      const p1 = peopleMap.get(rel.person_id);
      const p2 = peopleMap.get(rel.related_person_id);
      if (!p1 || !p2) return;

      if (rel.relationship_type === 'spouse') {
        if (!p1.spouseIds.includes(p2.id)) p1.spouseIds.push(p2.id);
      } else if (rel.relationship_type === 'child') {
        // person_id is parent, related_person_id is child
        if (!p1.childIds.includes(p2.id)) p1.childIds.push(p2.id);
        if (!p2.parentIds.includes(p1.id)) p2.parentIds.push(p1.id);
      } else if (rel.relationship_type === 'father' || rel.relationship_type === 'mother') {
        // person_id has father/mother = related_person_id
        // So related_person_id is parent of person_id
        if (!p2.childIds.includes(p1.id)) p2.childIds.push(p1.id);
        if (!p1.parentIds.includes(p2.id)) p1.parentIds.push(p2.id);
      }
    });

    // 6. Build tree: find root nodes (no parents in the set)
    const processedRoots = new Set();

    function buildTreeNode(personId, visited) {
      if (visited.has(personId)) return null;
      visited.add(personId);

      const person = peopleMap.get(personId);
      if (!person) return null;

      // Get spouse details
      const spouses = person.spouseIds
        .filter(sid => peopleMap.has(sid))
        .map(sid => {
          const s = peopleMap.get(sid);
          return { id: s.id, name: s.name, photo: s.photo, gender: s.gender, birth_date: s.birth_date, birth_year: s.birth_year, death_date: s.death_date, family_name: s.family_name, occupation: s.occupation };
        });

      // Deduplicate children from both parents
      const allChildIds = new Set(person.childIds);
      person.spouseIds.forEach(sid => {
        const spouse = peopleMap.get(sid);
        if (spouse) {
          spouse.childIds.forEach(cid => allChildIds.add(cid));
        }
      });

      const children = Array.from(allChildIds)
        .map(cid => buildTreeNode(cid, visited))
        .filter(Boolean);

      return {
        id: person.id,
        name: person.name,
        photo: person.photo,
        gender: person.gender,
        birth_date: person.birth_date,
        birth_year: person.birth_year,
        death_date: person.death_date,
        family_name: person.family_name,
        occupation: person.occupation,
        spouses: spouses,
        children: children,
      };
    }

    const roots = [];
    for (const person of peopleMap.values()) {
      if (person.parentIds.length === 0 && !processedRoots.has(person.id)) {
        // Condition 1: Check if they are just a spouse of an already processed root.
        // This stops spouse duplication when parsing.
        const isSpouseOfExistingRoot = Array.from(processedRoots).some(rid => {
          const root = peopleMap.get(rid);
          return root && root.spouseIds.includes(person.id);
        });
        if (isSpouseOfExistingRoot) continue;

        // Condition 2 (Single Root Mode Feature):
        // The core issue user mentioned: adding Govindbhai and his wife, wife gets mapped as
        // a 2nd disconnected tree because she has no parents. 
        // We look for ANY spouse that has parents, which means this person is just married into the tree.
        if (singleRootMode) {
          const isSpouseOfSomeoneWithParents = person.spouseIds.some(sid => {
            const spouse = peopleMap.get(sid);
            return spouse && spouse.parentIds.length > 0;
          });
          if (isSpouseOfSomeoneWithParents) continue;
        }

        processedRoots.add(person.id);
        person.spouseIds.forEach(sid => processedRoots.add(sid));

        const node = buildTreeNode(person.id, new Set(person.spouseIds));
        if (node) roots.push(node);
      }
    }

    // 7. Build adjacency connections for frontend highlighting
    const connections = { parents: {}, children: {}, spouses: {} };
    for (const person of peopleMap.values()) {
      if (person.spouseIds.length > 0) connections.spouses[person.id] = person.spouseIds;
      if (person.childIds.length > 0) connections.children[person.id] = person.childIds;
      if (person.parentIds.length > 0) connections.parents[person.id] = person.parentIds;
    }

    return NextResponse.json({
      success: true,
      data: {
        tree: roots,
        connections
      }
    });

  } catch (error) {
    console.error('Error fetching family tree:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
