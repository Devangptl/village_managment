'use client';

import React, { useState, useEffect } from 'react';
import FamilyTree from '@/components/family-tree/FamilyTree';

export default function FamilyTreePage() {
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState('');
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  // Fetch list of families on mount
  useEffect(() => {
    fetch('/api/families')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setFamilies(data.data);
          setSelectedFamily(data.data[0]);
        }
      })
      .catch(err => console.error('Failed to fetch families', err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch tree data when selectedFamily changes
  useEffect(() => {
    if (!selectedFamily) return;

    setLoading(true);
    setTreeData(null);
    setSelectedPersonId(null);

    fetch('/api/family-tree?family=' + encodeURIComponent(selectedFamily))
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTreeData(data.data);
        } else {
          console.error(data.error);
        }
      })
      .catch(err => console.error('Failed to fetch tree data', err))
      .finally(() => setLoading(false));
  }, [selectedFamily]);

  const handlePersonClick = (id) => {
    setSelectedPersonId(prev => prev === id ? null : id);
  };

  // Calculate stats from tree data
  const memberCount = treeData?.tree ? countMembers(treeData.tree) : 0;
  const generationCount = treeData?.tree ? countGenerations(treeData.tree) : 0;
  const activeCount = treeData?.tree ? countActiveMembers(treeData.tree) : 0;

  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-['Outfit']">Family Tree</h1>
          <p className="text-emerald-100/80 text-xl max-w-2xl mx-auto">
            Explore the roots and branches of our village families
          </p>
        </div>
      </section>

      {/* Controls Section */}
      <section className="bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            {/* Family Selector */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-lg shadow-md">
                🌳
              </div>
              <div>
                <label htmlFor="family-select" className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">
                  Select Family
                </label>
                <select
                  id="family-select"
                  value={selectedFamily}
                  onChange={(e) => setSelectedFamily(e.target.value)}
                  className="border border-gray-200 rounded-lg py-1.5 px-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 min-w-[180px] text-sm font-semibold"
                >
                  {families.map(f => (
                    <option key={f} value={f}>{f} Family</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stats Pills */}
            {treeData && !loading && (
              <div className="flex items-center gap-3">
                <div className="ft-stat-pill">
                  <span>👥</span>
                  <span>{memberCount} Members</span>
                </div>
                <div className="ft-stat-pill">
                  <span>💚</span>
                  <span>{activeCount} Active</span>
                </div>
                <div className="ft-stat-pill">
                  <span>🏛️</span>
                  <span>{generationCount} Generations</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tree Section */}
      <section className="bg-gradient-to-br from-emerald-50/50 to-teal-50/30 min-h-[60vh]">
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm min-h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="spinner" />
                <span className="text-sm text-gray-500 font-medium">Loading family tree...</span>
              </div>
            </div>
          )}

          {treeData ? (
            <FamilyTree
              data={treeData}
              onPersonClick={handlePersonClick}
              selectedPersonId={selectedPersonId}
            />
          ) : !loading && families.length > 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="text-6xl mb-4">🌳</div>
              <h3 className="text-xl font-semibold text-gray-700 font-['Outfit']">Select a Family</h3>
              <p className="text-gray-400 mt-2">Choose a family from the dropdown to view their tree.</p>
            </div>
          ) : !loading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-700 font-['Outfit']">No Family Records</h3>
              <p className="text-gray-400 mt-2">No family records found. Please check back later.</p>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

// Helper to count all unique members in the tree recursively
function countMembers(nodes, seen = new Set()) {
  for (const node of nodes) {
    if (!seen.has(node.id)) {
      seen.add(node.id);
    }
    if (node.spouses) {
      for (const s of node.spouses) {
        if (!seen.has(s.id)) seen.add(s.id);
      }
    }
    if (node.children) countMembers(node.children, seen);
  }
  return seen.size;
}

// Helper to count max depth/generations (only count from first root with children)
function countGenerations(nodes, depth = 1, seen = new Set()) {
  let max = depth;
  for (const node of nodes) {
    if (seen.has(node.id)) continue;
    seen.add(node.id);
    if (node.children && node.children.length > 0) {
      max = Math.max(max, countGenerations(node.children, depth + 1, seen));
    }
  }
  return max;
}

// Helper to count active (alive) members
function countActiveMembers(nodes, seen = new Set()) {
  let count = 0;
  for (const node of nodes) {
    if (!seen.has(node.id)) {
      seen.add(node.id);
      if (!node.death_date) count++;
    }
    if (node.spouses) {
      for (const s of node.spouses) {
        if (!seen.has(s.id)) {
          seen.add(s.id);
          if (!s.death_date) count++;
        }
      }
    }
    if (node.children) count += countActiveMembers(node.children, seen);
  }
  return count;
}
