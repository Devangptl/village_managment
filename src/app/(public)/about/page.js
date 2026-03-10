import { query } from '@/lib/db';

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
    { icon: '👥', label: 'Population', value: vd.population || '5,200', color: 'from-blue-500 to-blue-600' },
    { icon: '📏', label: 'Area', value: vd.area || '12.5 sq km', color: 'from-emerald-500 to-teal-500' },
    { icon: '📮', label: 'Pin Code', value: vd.pincode || '411001', color: 'from-orange-400 to-red-500' },
    { icon: '🏛️', label: 'District', value: vd.district || 'Pune', color: 'from-purple-500 to-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img 
            src={vd.village_image || "https://images.unsplash.com/photo-1596423735882-3f19e4856f61?q=80&w=2938&auto=format&fit=crop"} 
            alt="Village Landscape" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-emerald-900/70 to-gray-900/40"></div>
          <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-emerald-500/20 rounded-full blur-3xl z-0" />
          <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-teal-500/20 rounded-full blur-3xl z-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 mx-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-medium tracking-wide uppercase text-emerald-100">Welcome to Our Community</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 font-['Outfit'] tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{vd.village_name || 'Jantralkampa'}</span>
          </h1>
          <p className="text-emerald-50 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
            Discover the rich heritage, warm community, and progressive vision of our vibrant village.
          </p>
        </div>
      </section>

      {/* Stats - Overlapping Hero */}
      <section className="relative -mt-16 z-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, idx) => (
              <div 
                key={stat.label} 
                className="group bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-white/50"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} p-0.5 mb-4 transform group-hover:rotate-6 transition-transform duration-500`}>
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 font-['Outfit'] mb-1 tracking-tight">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-50 rounded-full blur-3xl opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-3xl transform -rotate-6 scale-105 opacity-50 blur-lg transition-transform hover:rotate-0 duration-500"></div>
              <div className="relative w-full aspect-[4/3] rounded-3xl bg-gray-100 overflow-hidden shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2787&auto=format&fit=crop" 
                  alt="History" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-500 border-4 border-white">
                <span className="text-sm font-semibold uppercase tracking-wider opacity-90">Est.</span>
                <span className="text-3xl font-bold font-['Outfit']">1850</span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold tracking-wider mb-6 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                OUR STORY
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 font-['Outfit'] tracking-tight">
                A Legacy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Community</span>
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed relative pl-6 border-l-4 border-emerald-100">
                <p>
                  {vd.village_history || 'Jantralkampa has a rich history spanning over a century of community spirit and development. Nestled in the heart of nature, our village has grown from a humble settlement into a thriving, self-sustaining community.'}
                </p>
                <p>
                  Generations have contributed to preserving our vibrant culture while embracing modern advancements, making us a shining example of harmonious living.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 relative bg-gray-900 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 font-['Outfit'] tracking-tight">Our Vision Forward</h2>
            <p className="text-emerald-100/70 text-lg">Pioneering a future that balances technological advancement with environmental stewardship and cultural preservation.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ), 
                title: 'Sustainable Growth', 
                desc: 'Eco-friendly development that preserves our natural beauty while improving vital infrastructure for all generations.',
                color: 'from-emerald-400 to-emerald-600'
              },
              { 
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ), 
                title: 'Education for All', 
                desc: 'Quality education accessible to every child, equipped with modern digital facilities and dedicated educators.',
                color: 'from-teal-400 to-teal-600'
              },
              { 
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ), 
                title: 'Digital Village', 
                desc: 'Embracing next-gen technology to bring seamless transparency, civic efficiency, and global connectivity.',
                color: 'from-cyan-400 to-blue-600'
              },
            ].map((item) => (
              <div key={item.title} className="group relative bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 p-8 rounded-3xl transition-all duration-500 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} rounded-bl-full opacity-20 transform translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500`}></div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-8 shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-['Outfit']">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
