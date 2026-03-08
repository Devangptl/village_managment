'use client';
import { useState, useEffect } from 'react';

export default function AdminDirectoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'General', phone: '', email: '', address: '', description: '', is_active: true });

  const fetchItems = () => { fetch('/api/directory').then((r) => r.json()).then((d) => { setItems(d); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(fetchItems, []);

  const resetForm = () => { setForm({ name: '', category: 'General', phone: '', email: '', address: '', description: '', is_active: true }); setEditId(null); setShowForm(false); };

  const handleEdit = (item) => { setForm({ name: item.name, category: item.category || 'General', phone: item.phone || '', email: item.email || '', address: item.address || '', description: item.description || '', is_active: item.is_active }); setEditId(item.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) { await fetch(`/api/directory/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); }
    else { await fetch('/api/directory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); }
    resetForm(); fetchItems();
  };

  const handleDelete = async (id) => { if (!confirm('Delete this entry?')) return; await fetch(`/api/directory/${id}`, { method: 'DELETE' }); fetchItems(); };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-gray-900 font-['Outfit']">Manage Directory</h1><p className="text-gray-500 mt-1">{items.length} entries</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">+ New Entry</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5 font-['Outfit']">{editId ? 'Edit' : 'New'} Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-input" /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-input" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="form-input" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-input resize-none" /></div>
            <div className="flex gap-3"><button type="submit" className="btn-primary">{editId ? 'Update' : 'Create'}</button><button type="button" onClick={resetForm} className="btn-secondary">Cancel</button></div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table"><thead><tr><th>Name</th><th>Category</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>{items.map((item) => (
            <tr key={item.id}>
              <td className="font-medium">{item.name}</td>
              <td><span className="badge badge-resolved">{item.category}</span></td>
              <td className="text-sm text-gray-500">{item.phone || '-'}</td>
              <td><div className="flex gap-2"><button onClick={() => handleEdit(item)} className="text-sm text-blue-600 hover:underline">Edit</button><button onClick={() => handleDelete(item.id)} className="text-sm text-red-600 hover:underline">Delete</button></div></td>
            </tr>
          ))}</tbody>
        </table>
        </div>
        {items.length === 0 && <p className="text-center py-10 text-gray-400">No directory entries yet</p>}
      </div>
    </div>
  );
}
