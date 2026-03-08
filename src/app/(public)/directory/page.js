'use client';
import { useState, useEffect } from 'react';

export default function DirectoryPage() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/directory')
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(entries.map((e) => e.category))];

  const filtered = entries.filter((e) => {
    const matchesCategory = activeCategory === 'All' || e.category === activeCategory;
    const matchesSearch =
      search === '' ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="gradient-hero pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-['Outfit']">Village Directory</h1>
          <p className="text-emerald-100/80 text-xl">Find local businesses, offices, and contacts</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search directory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-12"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-700">No entries found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((entry) => (
                <div key={entry.id} className="glass-card p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{entry.name}</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                      {entry.category}
                    </span>
                  </div>
                  {entry.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{entry.description}</p>
                  )}
                  <div className="space-y-2 text-sm text-gray-600">
                    {entry.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📞</span>
                        <a href={`tel:${entry.phone}`} className="hover:text-emerald-600 transition-colors">{entry.phone}</a>
                      </div>
                    )}
                    {entry.email && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📧</span>
                        <a href={`mailto:${entry.email}`} className="hover:text-emerald-600 transition-colors">{entry.email}</a>
                      </div>
                    )}
                    {entry.address && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📍</span>
                        <span>{entry.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
