'use client';
import { useState, useEffect } from 'react';

export default function AdminEventsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', image: '', event_date: '', event_time: '', location: '', is_published: true });
  const [uploading, setUploading] = useState(false);

  const fetchItems = () => {
    fetch('/api/events').then((r) => r.json()).then((d) => { setItems(d); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchItems, []);

  const resetForm = () => {
    setForm({ title: '', description: '', image: '', event_date: '', event_time: '', location: '', is_published: true });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title, description: item.description, image: item.image || '',
      event_date: item.event_date?.split('T')[0] || '', event_time: item.event_time || '',
      location: item.location || '', is_published: item.is_published,
    });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    try { const res = await fetch('/api/upload', { method: 'POST', body: fd }); const data = await res.json(); if (data.url) setForm({ ...form, image: data.url }); } catch {/**/}
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await fetch(`/api/events/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    resetForm(); fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' }); fetchItems();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-gray-900 font-['Outfit']">Manage Events</h1><p className="text-gray-500 mt-1">{items.length} events</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">+ New Event</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5 font-['Outfit']">{editId ? 'Edit' : 'New'} Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description *</label><textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-input resize-none" /></div>
            <div className="grid md:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Date *</label><input type="date" required value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="form-input" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Time</label><input type="text" value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })} className="form-input" placeholder="e.g. 09:00 AM" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="form-input" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Image</label><div className="flex items-center gap-3"><input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />{uploading && <span className="text-xs text-gray-400">Uploading...</span>}{form.image && <img src={form.image} alt="" className="w-16 h-16 object-cover rounded-lg" />}</div></div>
            <div className="flex gap-3"><button type="submit" className="btn-primary">{editId ? 'Update' : 'Create'}</button><button type="button" onClick={resetForm} className="btn-secondary">Cancel</button></div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table"><thead><tr><th>Event</th><th>Date</th><th>Location</th><th>Actions</th></tr></thead>
          <tbody>{items.map((item) => (
            <tr key={item.id}>
              <td className="font-medium">{item.title}</td>
              <td className="text-sm">{item.event_date ? new Date(item.event_date).toLocaleDateString() : '-'}</td>
              <td className="text-sm text-gray-500">{item.location || '-'}</td>
              <td><div className="flex gap-2"><button onClick={() => handleEdit(item)} className="text-sm text-blue-600 hover:underline">Edit</button><button onClick={() => handleDelete(item.id)} className="text-sm text-red-600 hover:underline">Delete</button></div></td>
            </tr>
          ))}</tbody>
        </table>
        </div>
        {items.length === 0 && <p className="text-center py-10 text-gray-400">No events yet</p>}
      </div>
    </div>
  );
}
