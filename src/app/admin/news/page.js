'use client';
import { useState, useEffect } from 'react';

export default function AdminNewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', content: '', excerpt: '', image: '', is_published: true });
  const [uploading, setUploading] = useState(false);

  const fetchItems = () => {
    fetch('/api/news').then((r) => r.json()).then((d) => { setItems(d); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchItems, []);

  const resetForm = () => {
    setForm({ title: '', slug: '', content: '', excerpt: '', image: '', is_published: true });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, slug: item.slug, content: item.content, excerpt: item.excerpt || '', image: item.image || '', is_published: item.is_published });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setForm({ ...form, image: data.url });
    } catch {/**/}
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const body = { ...form, slug };

    if (editId) {
      await fetch(`/api/news/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch('/api/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    resetForm();
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    await fetch(`/api/news/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-['Outfit']">Manage News</h1>
          <p className="text-gray-500 mt-1">{items.length} articles</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">+ New Article</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5 font-['Outfit']">{editId ? 'Edit' : 'New'} Article</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="form-input" placeholder="auto-generated" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <input type="text" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea required rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="form-input resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
                {uploading && <span className="text-xs text-gray-400">Uploading...</span>}
                {form.image && <img src={form.image} alt="" className="w-16 h-16 object-cover rounded-lg" />}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} id="published" className="w-4 h-4 rounded text-emerald-600" />
              <label htmlFor="published" className="text-sm text-gray-700">Published</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">{editId ? 'Update' : 'Create'}</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
            <tr><th>Title</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="font-medium">{item.title}</td>
                <td>
                  <span className={`badge ${item.is_published ? 'badge-resolved' : 'badge-pending'}`}>
                    {item.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="text-gray-400 text-sm">{new Date(item.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="text-sm text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {items.length === 0 && <p className="text-center py-10 text-gray-400">No news articles yet</p>}
      </div>
    </div>
  );
}
