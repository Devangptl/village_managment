'use client';
import { useState, useEffect } from 'react';

const fields = [
  { key: 'village_name', label: 'Village Name' },
  { key: 'village_description', label: 'Village Description', type: 'textarea' },
  { key: 'village_history', label: 'Village History', type: 'textarea' },
  { key: 'population', label: 'Population' },
  { key: 'area', label: 'Area' },
  { key: 'pincode', label: 'Pin Code' },
  { key: 'state', label: 'State' },
  { key: 'district', label: 'District' },
  { key: 'sarpanch_name', label: 'Sarpanch Name' },
  { key: 'sarpanch_message', label: 'Sarpanch Message', type: 'textarea' },
  { key: 'village_phone', label: 'Village Phone' },
  { key: 'village_email', label: 'Village Email' },
  { key: 'village_address', label: 'Village Address', type: 'textarea' },
  { key: 'map_embed', label: 'Google Maps Embed URL' },
];

export default function AdminVillageDataPage() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    fetch('/api/village-data').then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/village-data', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      setData((prev) => ({ ...prev, village_logo: result.url }));
    } catch (error) {
      alert('Failed to upload logo: ' + error.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-['Outfit']">Village Data</h1>
          <p className="text-gray-500 mt-1">Manage village information displayed on the website</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-emerald-600 text-sm font-medium">✓ Saved successfully!</span>}
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Website Logo</h2>
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            {data.village_logo ? (
              <img src={data.village_logo} alt="Logo" className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-4xl">🏡</span>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploadingLogo}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">Recommended size: 200x200px. PNG or SVG with transparent background.</p>
            {uploadingLogo && <p className="text-emerald-600 text-sm mt-2 flex items-center gap-2"><div className="spinner w-4 h-4 border-emerald-600 border-t-transparent" /> Uploading...</p>}
            
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Show Dynamic Logo</h3>
                <p className="text-xs text-gray-500 mt-0.5">Display the uploaded logo instead of the default emoji.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={data.show_dynamic_logo !== 'false'}
                  onChange={(e) => setData({ ...data, show_dynamic_logo: e.target.checked ? 'true' : 'false' })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Family Tree Single Root Mode</h3>
                <p className="text-xs text-gray-500 mt-0.5">Display only the primary continuous lineage tree (hides disconnected spouse ancestors).</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={data.family_tree_single_root === 'true'}
                  onChange={(e) => setData({ ...data, family_tree_single_root: e.target.checked ? 'true' : 'false' })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">General Information</h2>
        <div className="space-y-5">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={data[field.key] || ''}
                  onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
                  className="form-input resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={data[field.key] || ''}
                  onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
                  className="form-input"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
