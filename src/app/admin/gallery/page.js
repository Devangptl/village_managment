'use client';
import { useState, useEffect } from 'react';

export default function AdminGalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'General' });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchImages = () => {
    fetch('/api/gallery').then((r) => r.json()).then((d) => { setImages(d); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchImages, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);

    const fd = new FormData();
    fd.append('file', selectedFile);
    try {
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
      const uploadData = await uploadRes.json();
      if (uploadData.url) {
        await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: form.title, image_url: uploadData.url, category: form.category }),
        });
        setForm({ title: '', category: 'General' });
        setSelectedFile(null);
        setShowUpload(false);
        fetchImages();
      }
    } catch {/**/}
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    fetchImages();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-gray-900 font-['Outfit']">Manage Gallery</h1><p className="text-gray-500 mt-1">{images.length} photos</p></div>
        <button onClick={() => setShowUpload(!showUpload)} className="btn-primary">+ Upload Photo</button>
      </div>

      {showUpload && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5 font-['Outfit']">Upload Photo</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" placeholder="Photo title" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-input" placeholder="e.g. Events, Village, Nature" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Image *</label><input type="file" required accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="text-sm" /></div>
            <div className="flex gap-3"><button type="submit" disabled={uploading} className="btn-primary">{uploading ? 'Uploading...' : 'Upload'}</button><button type="button" onClick={() => setShowUpload(false)} className="btn-secondary">Cancel</button></div>
          </form>
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-20"><div className="text-6xl mb-4">📸</div><h3 className="text-xl font-semibold text-gray-700">No photos yet</h3></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group relative">
              <img src={img.image_url} alt={img.title || 'Gallery'} className="w-full h-48 object-cover" />
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{img.title || 'Untitled'}</p>
                <p className="text-xs text-gray-400">{img.category}</p>
              </div>
              <button onClick={() => handleDelete(img.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm shadow-lg hover:bg-red-600">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
