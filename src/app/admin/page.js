'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ news: 0, events: 0, complaints: 0, messages: 0, gallery: 0, services: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/news').then((r) => r.json()),
      fetch('/api/events').then((r) => r.json()),
      fetch('/api/complaints').then((r) => r.json()),
      fetch('/api/contact').then((r) => r.json()),
      fetch('/api/gallery').then((r) => r.json()),
      fetch('/api/services').then((r) => r.json()),
    ])
      .then(([news, events, complaints, messages, gallery, services]) => {
        setStats({
          news: news.length,
          events: events.length,
          complaints: complaints.length,
          messages: messages.length,
          gallery: gallery.length,
          services: services.length,
        });
        setRecentComplaints(complaints.slice(0, 5));
        setRecentMessages(messages.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'News Articles', value: stats.news, icon: '📰', color: 'from-blue-500 to-blue-600', href: '/admin/news' },
    { label: 'Events', value: stats.events, icon: '📅', color: 'from-purple-500 to-purple-600', href: '/admin/events' },
    { label: 'Complaints', value: stats.complaints, icon: '📝', color: 'from-amber-500 to-orange-500', href: '/admin/complaints' },
    { label: 'Messages', value: stats.messages, icon: '✉️', color: 'from-emerald-500 to-emerald-600', href: '/admin/messages' },
    { label: 'Gallery Photos', value: stats.gallery, icon: '📸', color: 'from-pink-500 to-rose-500', href: '/admin/gallery' },
    { label: 'Services', value: stats.services, icon: '🏛️', color: 'from-cyan-500 to-teal-500', href: '/admin/services' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-['Outfit']">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your village portal.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="group">
            <div className={`bg-gradient-to-r ${card.color} rounded-2xl p-5 text-white shadow-lg group-hover:shadow-xl transition-all group-hover:-translate-y-1`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{card.icon}</span>
                <span className="text-3xl font-bold font-['Outfit']">{card.value}</span>
              </div>
              <p className="text-white/80 text-sm font-medium">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 font-['Outfit']">Recent Complaints</h2>
            <Link href="/admin/complaints" className="text-emerald-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          {recentComplaints.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No complaints yet</p>
          ) : (
            <div className="space-y-3">
              {recentComplaints.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.subject}</p>
                    <p className="text-xs text-gray-400">{c.name} • {new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge badge-${c.status?.replace('_', '-') || 'pending'}`}>
                    {c.status || 'pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 font-['Outfit']">Recent Messages</h2>
            <Link href="/admin/messages" className="text-emerald-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{m.subject || m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
