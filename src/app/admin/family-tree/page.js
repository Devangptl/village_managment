'use client';
import { useState, useEffect, useCallback } from 'react';
import FamilyTree from '@/components/family-tree/FamilyTree';

export default function AdminFamilyTreePage() {
  // Tab state
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'members'

  // Data state
  const [people, setPeople] = useState([]);
  const [allPeople, setAllPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showRelationshipForm, setShowRelationshipForm] = useState(false);
  const [relationshipForm, setRelationshipForm] = useState({ related_person_id: '', relationship_type: 'child' });
  const [activeFamilyFilter, setActiveFamilyFilter] = useState('All');
  const [form, setForm] = useState({
    name: '', photo: '', gender: 'male', birth_date: '', death_date: '',
    family_name: '', phone: '', occupation: '', bio: ''
  });

  // Tree preview state
  const [treeData, setTreeData] = useState(null);
  const [treeFamily, setTreeFamily] = useState('');
  const [treeLoading, setTreeLoading] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [familyNames, setFamilyNames] = useState([]);

  const fetchPeople = () => {
    fetch('/api/people')
      .then((r) => r.json())
      .then((d) => { setPeople(d); setAllPeople(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const fetchFamilyNames = () => {
    fetch('/api/families')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setFamilyNames(d.data);
          if (d.data.length > 0 && !treeFamily) setTreeFamily(d.data[0]);
        }
      })
      .catch(() => { });
  };

  const fetchTreeData = useCallback(() => {
    if (!treeFamily) return;
    setTreeLoading(true);
    fetch('/api/family-tree?family=' + encodeURIComponent(treeFamily))
      .then(r => r.json())
      .then(d => {
        if (d.success) setTreeData(d.data);
      })
      .catch(() => { })
      .finally(() => setTreeLoading(false));
  }, [treeFamily]);

  useEffect(() => { fetchPeople(); fetchFamilyNames(); }, []);
  useEffect(() => { fetchTreeData(); }, [fetchTreeData]);

  const resetForm = () => {
    setForm({ name: '', photo: '', gender: 'male', birth_date: '', death_date: '', family_name: '', phone: '', occupation: '', bio: '' });
    setEditId(null);
    setShowForm(false);
    setSelectedPerson(null);
    setShowRelationshipForm(false);
  };

  const handleEdit = async (person) => {
    setForm({
      name: person.name || '',
      photo: person.photo || '',
      gender: person.gender || 'male',
      birth_date: person.birth_date ? person.birth_date.split('T')[0] : '',
      death_date: person.death_date ? person.death_date.split('T')[0] : '',
      family_name: person.family_name || '',
      phone: person.phone || '',
      occupation: person.occupation || '',
      bio: person.bio || ''
    });
    setEditId(person.id);
    setShowForm(true);
    setActiveTab('members');
    try {
      const res = await fetch('/api/people/' + person.id);
      const data = await res.json();
      setSelectedPerson(data);
    } catch (e) { /* continue */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? '/api/people/' + editId : '/api/people';
    const method = editId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    resetForm();
    fetchPeople();
    fetchFamilyNames();
    fetchTreeData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this person? All their relationships will also be deleted.')) return;
    await fetch('/api/people/' + id, { method: 'DELETE' });
    if (editId === id) resetForm();
    fetchPeople();
    fetchFamilyNames();
    fetchTreeData();
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setForm({ ...form, photo: data.url });
  };

  const handleAddRelationship = async (e) => {
    e.preventDefault();
    if (!editId || !relationshipForm.related_person_id) return;
    await fetch('/api/people/' + editId + '/relationships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(relationshipForm)
    });
    setRelationshipForm({ related_person_id: '', relationship_type: 'child' });
    setShowRelationshipForm(false);
    const res = await fetch('/api/people/' + editId);
    const data = await res.json();
    setSelectedPerson(data);
    fetchPeople();
    fetchTreeData();
  };

  const handleRemoveRelationship = async (relationshipId) => {
    if (!confirm('Remove this relationship?')) return;
    await fetch('/api/people/' + editId + '/relationships?relationshipId=' + relationshipId, { method: 'DELETE' });
    const res = await fetch('/api/people/' + editId);
    const data = await res.json();
    setSelectedPerson(data);
    fetchPeople();
    fetchTreeData();
  };

  const allFamilyNames = ['All', ...new Set(allPeople.map(p => p.family_name).filter(Boolean))].sort();

  const filtered = people.filter((p) => {
    const matchesSearch = search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.family_name && p.family_name.toLowerCase().includes(search.toLowerCase()));
    const matchesFamily = activeFamilyFilter === 'All' || p.family_name === activeFamilyFilter;
    return matchesSearch && matchesFamily;
  });

  const stats = {
    totalMembers: allPeople.length,
    activeMembers: allPeople.filter(p => !p.death_date).length,
    totalFamilies: new Set(allPeople.map(p => p.family_name).filter(Boolean)).size,
    maleCount: allPeople.filter(p => p.gender === 'male').length,
    femaleCount: allPeople.filter(p => p.gender === 'female').length,
  };

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getGenderColor = (gender) => {
    if (gender === 'female') return 'from-pink-400 to-rose-500';
    if (gender === 'male') return 'from-blue-400 to-indigo-500';
    return 'from-purple-400 to-violet-500';
  };

  if (loading) return <div className="flex justify-center flex-col items-center py-20 gap-4"><div className="spinner" /><p className="text-gray-400 text-sm">Loading database...</p></div>;

  return (
    <div className="animate-fade-in-up">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Members', value: stats.totalMembers, icon: '👥', color: 'emerald' },
          { label: 'Active', value: stats.activeMembers, icon: '💚', color: 'teal' },
          { label: 'Families', value: stats.totalFamilies, icon: '🏠', color: 'blue' },
          { label: 'Males', value: stats.maleCount, icon: '♂️', color: 'indigo' },
          { label: 'Females', value: stats.femaleCount, icon: '♀️', color: 'pink' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className={'w-12 h-12 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner bg-' + s.color + '-50 text-' + s.color + '-600'}>{s.icon}</div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-black text-gray-900 font-['Outfit']">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('tree')}
          className={'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ' + (activeTab === 'tree' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM9 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Tree Preview
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ' + (activeTab === 'members' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Manage Members
        </button>
      </div>

      {/* ================= TREE PREVIEW TAB ================= */}
      {activeTab === 'tree' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tree Controls */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 font-['Outfit'] flex items-center gap-2">
                <span className="text-emerald-500">🌳</span> Family Tree Visualization
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Select a family to preview its tree structure. Click a person to highlight their connections.</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={treeFamily}
                onChange={(e) => { setTreeFamily(e.target.value); setSelectedPersonId(null); }}
                className="border border-gray-200 rounded-lg py-2 px-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 min-w-[160px] text-sm font-medium shadow-sm"
              >
                {familyNames.map(f => (
                  <option key={f} value={f}>{f} Family</option>
                ))}
              </select>
              <button
                onClick={() => { setActiveTab('members'); resetForm(); setShowForm(true); }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Member
              </button>
            </div>
          </div>

          {/* Tree View */}
          <div className="h-[550px] relative">
            {treeLoading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-emerald-200 border-t-emerald-600"></div>
                  <span className="text-sm text-gray-400">Loading tree...</span>
                </div>
              </div>
            )}
            {treeData ? (
              <FamilyTree
                data={treeData}
                onPersonClick={(id) => setSelectedPersonId(prev => prev === id ? null : id)}
                selectedPersonId={selectedPersonId}
              />
            ) : !treeLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <div className="text-5xl opacity-50">🌳</div>
                <p>No tree data for this family.</p>
              </div>
            ) : null}
          </div>

          {/* Quick Edit from Tree */}
          {selectedPersonId && treeData && (
            <div className="px-6 py-4 border-t border-gray-100 bg-emerald-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold">
                  {(() => {
                    const p = allPeople.find(ap => ap.id === selectedPersonId);
                    return p ? p.name.charAt(0) : '?';
                  })()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {(() => { const p = allPeople.find(ap => ap.id === selectedPersonId); return p ? p.name : 'Unknown'; })()}
                  </p>
                  <p className="text-[11px] text-gray-400">Person selected — click Edit to manage details & relationships</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const p = allPeople.find(ap => ap.id === selectedPersonId);
                  if (p) handleEdit(p);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit Person
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= MEMBERS TAB ================= */}
      {activeTab === 'members' && (
        <>
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 font-['Outfit'] tracking-tight flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">👥</span>
                Member Directory
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-400 text-sm">{filtered.length} people</span>
                {activeFamilyFilter !== 'All' && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md uppercase border border-blue-100">{activeFamilyFilter}</span>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-input pl-10 pr-4 w-full lg:w-64 bg-gray-50/50 focus:bg-white transition-all border-gray-200"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>

              <select
                value={activeFamilyFilter}
                onChange={(e) => setActiveFamilyFilter(e.target.value)}
                className="form-input w-full sm:w-44 bg-gray-50/50 border-gray-200"
              >
                {allFamilyNames.map(f => <option key={f} value={f}>{f === 'All' ? 'All Families' : f}</option>)}
              </select>

              <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary whitespace-nowrap px-5 shadow-lg shadow-emerald-200/50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Member
              </button>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6 animate-fade-in-up">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 font-['Outfit'] flex items-center gap-2">
                  {editId ? <><span className="text-blue-500">✏️</span> Edit Person</> : <><span className="text-emerald-500">✨</span> Add New Person</>}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Personal Details
                    </h3>
                    <div className="grid md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input bg-white" placeholder="e.g. Ramesh Patel" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Family Name *</label>
                        <input type="text" required value={form.family_name} onChange={(e) => setForm({ ...form, family_name: e.target.value })} className="form-input bg-white" placeholder="e.g. Patel" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender *</label>
                        <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="form-input bg-white">
                          <option value="male">Male ♂</option>
                          <option value="female">Female ♀</option>
                          <option value="other">Other ⚧</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Timeline & Media */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Timeline & Contact
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Birth Date</label>
                          <input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} className="form-input bg-white text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Death Date <span className="text-gray-400 font-normal">(Optional)</span></label>
                          <input type="date" value={form.death_date} onChange={(e) => setForm({ ...form, death_date: e.target.value })} className="form-input bg-white text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-input bg-white text-sm" placeholder="+91..." />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation</label>
                          <input type="text" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className="form-input bg-white text-sm" placeholder="e.g. Farmer" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Media & Bio
                      </h3>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200">
                          {form.photo ? (
                            <div className="relative group">
                              <img src={form.photo} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-emerald-100 shadow-sm" />
                              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white" onClick={() => setForm({ ...form, photo: '' })}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </div>
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            </div>
                          )}
                          <div className="flex-1">
                            <label className="block w-full text-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors bg-white">
                              <span>{form.photo ? 'Change Photo' : 'Upload Photo'}</span>
                              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Biography</label>
                        <textarea rows={2} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="form-input bg-white resize-none flex-1 text-sm" placeholder="Brief note about this person..." />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button type="submit" className="btn-primary flex-1 sm:flex-none justify-center px-8 shadow-md shadow-emerald-200">
                      {editId ? 'Save Changes' : 'Create Person'}
                    </button>
                    <button type="button" onClick={resetForm} className="btn-secondary flex-1 sm:flex-none justify-center px-6">
                      Cancel
                    </button>
                  </div>
                </form>

                {/* Relationships Manager (Only in Edit Mode) */}
                {editId && selectedPerson && (
                  <div className="mt-8">
                    <div className="bg-emerald-50 rounded-2xl border border-emerald-100 overflow-hidden">
                      <div className="px-6 py-4 border-b border-emerald-100/50 bg-emerald-100/30 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-emerald-900 font-['Outfit'] flex items-center gap-2">
                            <span>🔗</span> Family Relationships
                          </h3>
                          <p className="text-sm text-emerald-700 mt-0.5">Manage connections for {form.name}</p>
                        </div>
                        <button
                          onClick={() => setShowRelationshipForm(!showRelationshipForm)}
                          className={'px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ' + (showRelationshipForm ? 'bg-white text-gray-600 border border-gray-200' : 'bg-emerald-600 text-white border border-emerald-700 shadow-emerald-200/50 hover:bg-emerald-700')}
                        >
                          {showRelationshipForm ? 'Close' : '+ Add Connection'}
                        </button>
                      </div>

                      <div className="p-6">
                        {showRelationshipForm && (
                          <form onSubmit={handleAddRelationship} className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-xl shadow-sm border border-emerald-100 mb-6 animate-fade-in-up">
                            <div className="flex-1 relative">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Select Person</label>
                              <select
                                value={relationshipForm.related_person_id}
                                onChange={(e) => setRelationshipForm({ ...relationshipForm, related_person_id: e.target.value })}
                                className="form-input flex-1 bg-gray-50 w-full"
                                required
                              >
                                <option value="">Choose a family member...</option>
                                {allPeople.filter((p) => p.id !== editId).map((p) => (
                                  <option key={p.id} value={p.id}>{p.name} {p.family_name ? '(' + p.family_name + ')' : ''}</option>
                                ))}
                              </select>
                            </div>
                            <div className="sm:w-48 relative">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Relationship</label>
                              <select
                                value={relationshipForm.relationship_type}
                                onChange={(e) => setRelationshipForm({ ...relationshipForm, relationship_type: e.target.value })}
                                className="form-input w-full bg-gray-50"
                              >
                                <option value="child">Child 👶</option>
                                <option value="spouse">Spouse 💑</option>
                                <option value="father">Father 👨</option>
                                <option value="mother">Mother 👩</option>
                              </select>
                            </div>
                            <div className="flex items-end pb-[2px]">
                              <button type="submit" className="btn-primary w-full sm:w-auto h-[42px]">Connect</button>
                            </div>
                          </form>
                        )}

                        {selectedPerson.relationships && selectedPerson.relationships.length > 0 ? (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedPerson.relationships.map((rel) => (
                              <div key={rel.relationship_id} className="group bg-white rounded-xl p-4 shadow-sm border border-emerald-100/60 hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between">
                                <div className="flex items-center gap-3 w-full">
                                  <div className="relative">
                                    {rel.photo ? (
                                      <img src={rel.photo} alt={rel.name} className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-white" />
                                    ) : (
                                      <div className={'w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm ring-2 ring-white bg-gradient-to-br ' + getGenderColor(rel.gender)}>
                                        {rel.name?.charAt(0)}
                                      </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                                      {rel.relationship_type === 'spouse' ? '💑' : rel.relationship_type === 'child' ? '👶' : rel.relationship_type === 'father' ? '👨' : '👩'}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate text-sm">{rel.name}</p>
                                    <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                      {rel.relationship_type}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveRelationship(rel.relationship_id)}
                                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-700"
                                    title="Remove connection"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-white/50 rounded-xl border border-dashed border-emerald-200">
                            <div className="text-4xl mb-2 opacity-50">👥</div>
                            <p className="text-emerald-800 font-medium">No relationships defined yet</p>
                            <p className="text-sm text-emerald-600/70 mt-1">Connect this person to parents, spouses, or children to build the tree.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Member Grid */}
          <div className="space-y-4">
            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((person) => (
                  <div
                    key={person.id}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group relative overflow-hidden flex flex-col"
                  >
                    <div className={'absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rounded-full opacity-10 bg-gradient-to-br ' + getGenderColor(person.gender)} />

                    <div className="flex items-start gap-4 mb-4 relative z-10">
                      <div className="relative">
                        {person.photo ? (
                          <img src={person.photo} alt={person.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-md group-hover:scale-110 transition-transform" />
                        ) : (
                          <div className={'w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-md bg-gradient-to-br transition-transform group-hover:scale-110 ' + getGenderColor(person.gender)}>
                            {person.name?.charAt(0)}
                          </div>
                        )}
                        <div className={'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white shadow-sm ' + (person.gender === 'female' ? 'bg-pink-500' : person.gender === 'male' ? 'bg-blue-500' : 'bg-purple-500')}>
                          {person.gender === 'female' ? '♀' : person.gender === 'male' ? '♂' : '⚧'}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate pr-4 font-['Outfit']">{person.name}</h3>
                        <p className="text-xs text-gray-500 font-medium truncate mt-1">{person.occupation || 'No occupation'}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                          {person.family_name || 'Individual'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mt-auto pt-4 border-t border-gray-50 relative z-10">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Timeline:</span>
                        <span className="text-gray-700 font-semibold">{formatDate(person.birth_date)} {person.death_date && ' - RIP'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Gender:</span>
                        <span className={'font-black uppercase tracking-widest ' + (person.gender === 'female' ? 'text-pink-600' : person.gender === 'male' ? 'text-blue-600' : 'text-purple-600')}>{person.gender}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-5 relative z-10">
                      <button
                        onClick={() => handleEdit(person)}
                        className="flex-1 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Manage
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
                        className="w-10 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"
                        title="Delete Member"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">
                  {search || activeFamilyFilter !== 'All' ? '🔍' : '👨‍👩‍👧‍👦'}
                </div>
                <h3 className="text-2xl font-black text-gray-800 font-['Outfit'] mb-2">
                  {search || activeFamilyFilter !== 'All' ? 'No results found' : 'Tree is empty'}
                </h3>
                <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
                  {search || activeFamilyFilter !== 'All'
                    ? "We couldn't find anyone matching your current filters."
                    : 'Your village family tree is looking a bit sparse. Start by adding members!'}
                </p>
                {!search && activeFamilyFilter === 'All' && (
                  <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary px-8">
                    Add First Member
                  </button>
                )}
                {(search || activeFamilyFilter !== 'All') && (
                  <button onClick={() => { setSearch(''); setActiveFamilyFilter('All'); }} className="btn-secondary px-8">
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
