import { query } from '@/lib/db';

export const metadata = {
  title: 'About - Green Valley Village',
  description: 'Learn about Green Valley Village - our history, leadership, demographics, and community values.',
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
    { icon: '👥', label: 'Population', value: vd.population || '5,200' },
    { icon: '📏', label: 'Area', value: vd.area || '12.5 sq km' },
    { icon: '📮', label: 'Pin Code', value: vd.pincode || '411001' },
    { icon: '🏛️', label: 'District', value: vd.district || 'Pune' },
  ];

  const leaders = [
    { name: vd.sarpanch_name || 'Shri Rajesh Kumar', role: 'Sarpanch', icon: '👤' },
    { name: 'Smt. Meena Patil', role: 'Deputy Sarpanch', icon: '👤' },
    { name: 'Shri Anil Jadhav', role: 'Gram Sevak', icon: '👤' },
    { name: 'Smt. Priya Sharma', role: 'Health Officer', icon: '👤' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-['Outfit']">About Our Village</h1>
          <p className="text-emerald-100/80 text-xl max-w-2xl mx-auto">
            Discover the rich heritage, warm community, and progressive vision of {vd.village_name || 'Green Valley Village'}.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">Our Story</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-['Outfit']">A Rich History of Community</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {vd.village_history || 'Green Valley Village has a rich history spanning over a century of community spirit and development.'}
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-80 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-xl">
                <span className="text-8xl">🏘️</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg font-['Outfit']">
                Est.<br />1850
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 font-['Outfit']">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">Village Leadership</h2>
            <p className="text-gray-500 mt-2">Meet the people serving our community</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((leader) => (
              <div key={leader.name} className="glass-card p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-200 to-teal-200 flex items-center justify-center mx-auto mb-4 text-3xl">
                  {leader.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{leader.name}</h3>
                <p className="text-sm text-emerald-600 font-medium">{leader.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">Our Vision</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🌿', title: 'Sustainable Growth', desc: 'Eco-friendly development that preserves our natural beauty while improving infrastructure.' },
              { icon: '📚', title: 'Education for All', desc: 'Quality education accessible to every child, with modern facilities and trained teachers.' },
              { icon: '💻', title: 'Digital Village', desc: 'Embracing technology to bring transparency, efficiency, and connectivity to our community.' },
            ].map((item) => (
              <div key={item.title} className="glass-card p-8 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
