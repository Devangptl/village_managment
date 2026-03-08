'use client';
import { useState, useEffect } from 'react';

export default function AdminMessagesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => { fetch('/api/contact').then((r) => r.json()).then((d) => { setItems(d); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(fetchItems, []);

  const handleMarkRead = async (id) => {
    await fetch(`/api/contact/${id}`, { method: 'PUT' });
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-['Outfit']">Contact Messages</h1>
        <p className="text-gray-500 mt-1">{items.length} messages</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl"><div className="text-6xl mb-4">✉️</div><h3 className="text-xl font-semibold text-gray-700">No messages yet</h3></div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className={`bg-white rounded-2xl shadow-sm border p-6 ${item.is_read ? 'border-gray-100' : 'border-emerald-200 bg-emerald-50/30'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {item.name}
                    {!item.is_read && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
                  </h3>
                  <p className="text-sm text-gray-500">{item.email}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</span>
              </div>
              {item.subject && <p className="text-sm font-medium text-gray-700 mb-2">{item.subject}</p>}
              <p className="text-sm text-gray-600 mb-4">{item.message}</p>
              <div className="flex gap-2">
                {!item.is_read && (
                  <button onClick={() => handleMarkRead(item.id)} className="text-sm text-emerald-600 hover:underline">Mark as Read</button>
                )}
                <button onClick={() => handleDelete(item.id)} className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
