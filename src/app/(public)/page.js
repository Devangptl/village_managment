import Link from 'next/link';
import { query } from '@/lib/db';

async function getHomeData() {
  try {
    const [announcements, news, events, villageData] = await Promise.all([
      query('SELECT * FROM announcements WHERE is_active = 1 ORDER BY priority DESC, created_at DESC LIMIT 5'),
      query('SELECT * FROM news WHERE is_published = 1 ORDER BY created_at DESC LIMIT 3'),
      query('SELECT * FROM events WHERE is_published = 1 ORDER BY event_date ASC LIMIT 3'),
      query('SELECT * FROM village_data'),
    ]);
    const vd = {};
    villageData.forEach((row) => { vd[row.data_key] = row.data_value; });
    return { announcements, news, events, villageData: vd };
  } catch {
    return { announcements: [], news: [], events: [], villageData: {} };
  }
}

const quickLinks = [
  { href: '/services', icon: '🏛️', title: 'Services', desc: 'Government services & certificates' },
  { href: '/complaints', icon: '📝', title: 'Complaints', desc: 'File & track complaints' },
  { href: '/directory', icon: '📖', title: 'Directory', desc: 'Find local businesses & offices' },
  { href: '/news', icon: '📰', title: 'News', desc: 'Latest village updates' },
  { href: '/events', icon: '📅', title: 'Events', desc: 'Upcoming village events' },
  { href: '/gallery', icon: '📸', title: 'Gallery', desc: 'Village photo gallery' },
];

export default async function HomePage() {
  const { announcements, news, events, villageData } = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center animated-gradient overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-emerald-100 text-sm mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Official Village Portal
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 animate-fade-in-up animate-delay-100 font-['Outfit']">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
                {villageData.village_name || 'Green Valley'}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100/80 mb-8 leading-relaxed animate-fade-in-up animate-delay-200">
              {villageData.village_description || 'A beautiful village dedicated to sustainable development and community well-being.'}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
              <Link href="/about" className="btn-primary text-base px-8 py-3.5 shadow-2xl">
                Explore Our Village
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-base">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Population', value: villageData.population || '5,200' },
              { label: 'Area', value: villageData.area || '12.5 sq km' },
              { label: 'District', value: villageData.district || 'Pune' },
              { label: 'State', value: villageData.state || 'Maharashtra' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">{stat.value}</div>
                <div className="text-emerald-200/70 text-xs uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Ticker */}
      {announcements.length > 0 && (
        <div className="bg-emerald-950 text-emerald-50 py-2.5 overflow-hidden border-b border-emerald-900/50 shadow-inner relative group">
          <div className="flex items-center">
            {/* Label */}
            <div className="relative z-10 shrink-0 bg-emerald-900 border border-emerald-800/50 px-5 py-1.5 rounded-r-full text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 shadow-lg backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Announcements
            </div>

            {/* Gradient Fades */}
            <div className="absolute left-[160px] top-0 bottom-0 w-24 bg-gradient-to-r from-emerald-950 to-transparent z-10 pointer-events-none fade-l"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-emerald-950 to-transparent z-10 pointer-events-none fade-r"></div>

            {/* Marquee Content */}
            <div className="flex flex-1 overflow-hidden ml-4">
              <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] items-center">
                {/* First set */}
                {announcements.map((a) => (
                  <div key={a.id} className="flex items-center mx-6">
                    <span className="text-emerald-400 mr-3 text-xs opacity-70">◆</span>
                    <span className="text-sm font-semibold text-white tracking-wide mr-2">{a.title}:</span>
                    <span className="text-sm text-emerald-100/90 font-medium">{a.content}</span>
                  </div>
                ))}
                {/* Duplicated set for seamless loop */}
                {announcements.map((a) => (
                  <div key={`${a.id}-dup`} className="flex items-center mx-6">
                    <span className="text-emerald-400 mr-3 text-xs opacity-70">◆</span>
                    <span className="text-sm font-semibold text-white tracking-wide mr-2">{a.title}:</span>
                    <span className="text-sm text-emerald-100/90 font-medium">{a.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-['Outfit']">
              What are you looking for?
            </h2>
            <p className="mt-3 text-gray-500 text-lg">Quick access to village services and information</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="glass-card p-6 text-center group cursor-pointer"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{link.icon}</div>
                <h3 className="font-semibold text-gray-800 text-sm">{link.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sarpanch Message */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12 flex flex-col md:flex-row gap-8 items-center">
            <div className="shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-5xl shadow-xl">
                👤
              </div>
            </div>
            <div>
              <div className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-2">
                Message from the Sarpanch
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 font-['Outfit']">
                {villageData.sarpanch_name || 'Village Sarpanch'}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg italic">
                &ldquo;{villageData.sarpanch_message || 'Welcome to our village website.'}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      {news.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">Latest News</h2>
                <p className="text-gray-500 mt-1">Stay updated with village developments</p>
              </div>
              <Link href="/news" className="btn-secondary text-sm">
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="glass-card overflow-hidden group">
                  <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-5xl">
                    📰
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-emerald-600 font-medium mb-2">
                      {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.excerpt || item.content}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">Upcoming Events</h2>
                <p className="text-gray-500 mt-1">Don&apos;t miss out on community activities</p>
              </div>
              <Link href="/events" className="btn-secondary text-sm">
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex flex-col items-center justify-center text-white shadow-lg">
                      <span className="text-lg font-bold leading-none">{new Date(event.event_date).getDate()}</span>
                      <span className="text-[10px] uppercase tracking-wider">{new Date(event.event_date).toLocaleDateString('en-IN', { month: 'short' })}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">{event.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {event.event_time && <span>🕐 {event.event_time}</span>}
                        {event.location && <span>📍 {event.location}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-hero rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-['Outfit']">Have a concern? We&apos;re here to help.</h2>
              <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                File a complaint, reach out to your panchayat, or share feedback to help us improve our village.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/complaints" className="px-8 py-3.5 bg-white text-emerald-800 font-semibold rounded-xl hover:bg-emerald-50 transition-all shadow-xl">
                  File a Complaint
                </Link>
                <Link href="/contact" className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
