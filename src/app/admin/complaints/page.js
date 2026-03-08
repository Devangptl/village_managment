'use client';
import { useState, useEffect } from 'react';

export default function AdminComplaintsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyId, setReplyId] = useState(null);
  const [replyForm, setReplyForm] = useState({ status: 'pending', admin_reply: '' });

  const fetchItems = () => { fetch('/api/complaints').then((r) => r.json()).then((d) => { setItems(d); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(fetchItems, []);

  const handleReply = (item) => { setReplyForm({ status: item.status || 'pending', admin_reply: item.admin_reply || '' }); setReplyId(item.id); };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    await fetch(`/api/complaints/${replyId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(replyForm) });
    setReplyId(null); fetchItems();
  };

  const handleDelete = async (id) => { if (!confirm('Delete this complaint?')) return; await fetch(`/api/complaints/${id}`, { method: 'DELETE' }); fetchItems(); };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-['Outfit']">Manage Complaints</h1>
        <p className="text-gray-500 mt-1">{items.length} complaints</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl"><div className="text-6xl mb-4">📝</div><h3 className="text-xl font-semibold text-gray-700">No complaints yet</h3></div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                  <p className="text-sm text-gray-500">{item.name} • {item.email} • {item.phone}</p>
                </div>
                <span className={`badge badge-${item.status?.replace('_', '-') || 'pending'}`}>{item.status || 'pending'}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              {item.admin_reply && (
                <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-emerald-700 font-semibold mb-1">Admin Reply:</p>
                  <p className="text-sm text-emerald-800">{item.admin_reply}</p>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(item.created_at).toLocaleString()}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleReply(item)} className="text-sm text-blue-600 hover:underline">Reply/Update</button>
                  <button onClick={() => handleDelete(item.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
              </div>

              {replyId === item.id && (
                <form onSubmit={handleSubmitReply} className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={replyForm.status} onChange={(e) => setReplyForm({ ...replyForm, status: e.target.value })} className="form-input">
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reply</label>
                    <textarea rows={3} value={replyForm.admin_reply} onChange={(e) => setReplyForm({ ...replyForm, admin_reply: e.target.value })} className="form-input resize-none" placeholder="Write your reply..." />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary text-sm">Update</button>
                    <button type="button" onClick={() => setReplyId(null)} className="btn-secondary text-sm">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
