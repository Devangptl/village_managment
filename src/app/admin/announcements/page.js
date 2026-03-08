'use client';
import { useState, useEffect } from 'react';

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', is_active: true, priority: 0 });

  const fetchItems = () => { fetch('/api/announcements').then((r) => r.json()).then((d) => { setItems(d); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(fetchItems, []);

  const resetForm = () => { setForm({ title: '', content: '', is_active: true, priority: 0 }); setEditId(null); setShowForm(false); };

  const handleEdit = (item) => { setForm({ title: item.title, content: item.content, is_active: item.is_active, priority: item.priority || 0 }); setEditId(item.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) { await fetch(`/api/announcements/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); }
    else { await fetch('/api/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); }
    resetForm(); fetchItems();
  };

  const toggleActive = async (item) => {
    await fetch(`/api/announcements/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, is_active: !item.is_active }) });
    fetchItems();
  };

  const handleDelete = async (id) => { if (!confirm('Delete this announcement?')) return; await fetch(`/api/announcements/${id}`, { method: 'DELETE' }); fetchItems(); };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-gray-900 font-['Outfit']">Manage Announcements</h1><p className="text-gray-500 mt-1">{items.length} announcements</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">+ New Announcement</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5 font-['Outfit']">{editId ? 'Edit' : 'New'} Announcement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Content *</label><textarea required rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="form-input resize-none" /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority (higher = more important)</label><input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} className="form-input" /></div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded text-emerald-600" /><span className="text-sm text-gray-700">Active</span></label>
              </div>
            </div>
            <div className="flex gap-3"><button type="submit" className="btn-primary">{editId ? 'Update' : 'Create'}</button><button type="button" onClick={resetForm} className="btn-secondary">Cancel</button></div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table"><thead><tr><th>Announcement</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{items.map((item) => (
            <tr key={item.id}>
              <td><div><p className="font-medium">{item.title}</p><p className="text-xs text-gray-400 truncate max-w-xs">{item.content}</p></div></td>
              <td className="text-sm">{item.priority}</td>
              <td>
                <button onClick={() => toggleActive(item)} className={`badge ${item.is_active ? 'badge-resolved' : 'badge-pending'} cursor-pointer`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td><div className="flex gap-2"><button onClick={() => handleEdit(item)} className="text-sm text-blue-600 hover:underline">Edit</button><button onClick={() => handleDelete(item.id)} className="text-sm text-red-600 hover:underline">Delete</button></div></td>
            </tr>
          ))}</tbody>
        </table>
        </div>
        {items.length === 0 && <p className="text-center py-10 text-gray-400">No announcements yet</p>}
      </div>
    </div>
  );
}
