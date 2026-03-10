import { query } from '@/lib/db';
import Link from 'next/link';

export const metadata = {
  title: 'About - Jantralkampa',
  description: 'Learn about Jantralkampa - our history, demographics, and community values.',
};

async function getAboutData() {
  try {
    const rows = await query('SELECT * FROM village_data');
    const vd = {};
    rows.forEach((r) => { vd[r.data_key] = r.data_value; });
    return vd;
  } catch {
    return {};
  }
}

export default async function AboutPage() {
  const vd = await getAboutData();

  const stats = [
    { icon: '👥', label: 'Population', value: vd.population || '5,200', color: 'from-blue-500 to-cyan-500' },
    { icon: '🗺️', label: 'Area', value: vd.area || '12.5 sq km', color: 'from-emerald-500 to-teal-500' },
    { icon: '📍', label: 'Pin Code', value: vd.pincode || '411001', color: 'from-amber-400 to-orange-500' },
    { icon: '🏛️', label: 'District', value: vd.district || 'Pune', color: 'from-purple-500 to-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="gradient-hero pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-['Outfit']">
            About {vd.village_name || 'Jantralkampa'}
          </h1>
          <p className="text-emerald-100/80 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Discover the rich heritage, warm community, and progressive vision of our vibrant village.
          </p>
        </div>
      </section>

      {/* Stats - Floating Cards */}
      <section className="relative -mt-12 z-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="group relative bg-white/60 backdrop-blur-xl p-5 rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 hover:bg-white/80 hover:shadow-lg hover:border-white hover:-translate-y-1 transition-all duration-300 overflow-hidden flex items-center gap-4"
              >
                <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${stat.color} p-[2px] shadow-sm transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                  <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-xl">
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800 font-['Outfit'] tracking-tight group-hover:text-emerald-700 transition-colors drop-shadow-sm">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Image Column */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-[2rem] transform rotate-3 group-hover:rotate-1 transition-transform duration-700 ease-out z-0"></div>
              <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl bg-white border border-white">
                <img
                  src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2787&auto=format&fit=crop"
                  alt="History of the Village"
                  className="w-full aspect-[4/3] object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
              </div>

              {/* Est Badge floating */}
              <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-6 rounded-3xl shadow-xl z-20 border border-slate-700/50 flex flex-col items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">Established</span>
                <span className="text-4xl font-black font-['Outfit']">1940</span>
              </div>
            </div>

            {/* Content Column */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold tracking-widest uppercase mb-6 border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Our Story
                </div>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight leading-tight">
                  A Legacy of <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Community</span>
                </h2>
              </div>

              <div className="space-y-6 text-slate-600 text-lg md:text-xl font-light leading-relaxed">
                <p>
                  {vd.village_history || 'Jantralkampa has a rich history spanning over a century of community spirit and development. Nestled in the heart of nature, our village has grown from a humble settlement into a thriving, self-sustaining community.'}
                </p>
                <p>
                  Generations have contributed to preserving our vibrant culture while embracing modern advancements, making us a shining example of harmonious living. Our commitment to sustainable growth ensures a bright future for generations to come.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold mb-1">Preserving Heritage</h4>
                    <p className="text-slate-500 text-sm">Honoring our roots while building tomorrow.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 relative bg-slate-900 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-to-t from-teal-500/10 to-transparent rounded-full blur-[120px] transform -translate-x-1/3 translate-y-1/3" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 font-['Outfit'] tracking-tight">Our Vision Forward</h2>
            <p className="text-slate-400 text-xl font-light">Pioneering a future that balances technological advancement with environmental stewardship and cultural preservation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 group/parent">
            {[
              {
                id: 1,
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Sustainable Growth',
                desc: 'Eco-friendly development that preserves our natural beauty while improving vital infrastructure for all generations.',
                color: 'from-emerald-400 to-emerald-600',
                glow: 'group-hover/card:shadow-[0_0_30px_rgba(52,211,153,0.3)]'
              },
              {
                id: 2,
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: 'Education for All',
                desc: 'Quality education accessible to every child, equipped with modern digital facilities and dedicated educators.',
                color: 'from-teal-400 to-cyan-600',
                glow: 'group-hover/card:shadow-[0_0_30px_rgba(45,212,191,0.3)]'
              },
              {
                id: 3,
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Digital Village',
                desc: 'Embracing next-gen technology to bring seamless transparency, civic efficiency, and global connectivity.',
                color: 'from-blue-400 to-indigo-600',
                glow: 'group-hover/card:shadow-[0_0_30px_rgba(96,165,250,0.3)]'
              },
            ].map((item) => (
              <div
                key={item.id}
                className={`group/card relative bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 p-10 rounded-[2.5rem] hover:bg-slate-800/80 hover:-translate-y-2 transition-all duration-500 overflow-hidden ${item.glow} hover:border-slate-600/50 md:group-hover/parent:[&:not(:hover)]:opacity-50 md:group-hover/parent:[&:not(:hover)]:scale-95 md:group-hover/parent:[&:not(:hover)]:blur-[2px]`}
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${item.color} rounded-bl-full opacity-10 transform translate-x-20 -translate-y-20 group-hover/card:translate-x-10 group-hover/card:-translate-y-10 group-hover/card:opacity-20 transition-all duration-700`}></div>
                <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${item.color} flex items-center justify-center mb-8 shadow-lg transform group-hover/card:-translate-y-2 group-hover/card:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-['Outfit']">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed group-hover/card:text-slate-300 transition-colors duration-300 font-light text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[3rem] p-12 md:p-20 shadow-2xl border border-emerald-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-200/50 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4"></div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 font-['Outfit'] tracking-tight relative z-10">
              Be a Part of Our <span className="text-emerald-600">Journey</span>
            </h2>
            <p className="text-slate-600 md:text-xl font-light max-w-2xl mx-auto mb-10 relative z-10">
              Whether you are a resident or a well-wisher, explore our community directory or get involved in our upcoming events.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/directory" className="px-8 py-4 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-center border border-slate-700">
                Explore Directory
              </Link>
              <Link href="/contact" className="px-8 py-4 rounded-full bg-white text-slate-900 font-semibold border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full sm:w-auto text-center">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
