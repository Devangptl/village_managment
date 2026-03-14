'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { HomeStatCardSkeleton, HomeNewsCardSkeleton, HomeEventCardSkeleton, AnnouncementSkeleton } from '@/components/Skeletons';

export default function HomePage() {
  const [data, setData] = useState({
    announcements: [],
    news: [],
    events: [],
    villageData: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/home')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch home data');
        return res.json();
      })
      .then((json) => {
        setData({
          announcements: json.announcements || [],
          news: json.news || [],
          events: json.events || [],
          villageData: json.villageData || {},
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Fetch ERROR in getHomeData:", error);
        setLoading(false);
      });
  }, []);

  const { announcements, news, events, villageData } = data;

const quickLinks = [
  { href: '/services', icon: '🏛️', title: 'Services', desc: 'Government services & certificates' },
  { href: '/complaints', icon: '📝', title: 'Complaints', desc: 'File & track complaints' },
  { href: '/directory', icon: '📖', title: 'Directory', desc: 'Find local businesses & offices' },
  { href: '/news', icon: '📰', title: 'News', desc: 'Latest village updates' },
  { href: '/events', icon: '📅', title: 'Events', desc: 'Upcoming village events' },
  { href: '/gallery', icon: '📸', title: 'Gallery', desc: 'Village photo gallery' },
];



  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-slate-950 pt-20">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-b from-emerald-500/20 to-teal-900/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-emerald-900/40 to-emerald-600/10 blur-[100px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-[340px] sm:pb-80 lg:pb-56 w-full z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

            {/* Left Content */}
            <div className="flex-1 max-w-3xl lg:max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-8 animate-fade-in-up backdrop-blur-md">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span className="w-2 h-2 bg-emerald-400 rounded-full absolute" />
                Next Generation Village Portal
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 animate-fade-in-up animate-delay-100 tracking-tight leading-[1.1] font-['Outfit']">
                Welcome to{' '}
                <span className="relative inline-block w-full lg:w-auto mt-2 lg:mt-0">
                  <span className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-teal-400 blur-2xl opacity-20" />
                  <span className="relative bg-gradient-to-br from-emerald-300 via-white to-teal-200 bg-clip-text text-transparent">
                    {loading ? <span className="inline-block w-64 h-16 sm:h-20 lg:h-24 bg-slate-700/50 rounded-2xl animate-pulse align-middle"></span> : (villageData.village_name || 'Jantralkampa')}
                  </span>
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed animate-fade-in-up animate-delay-200 max-w-2xl mx-auto lg:mx-0 font-light z-20 relative">
                {loading ? (
                   <span className="inline-block w-full h-20 bg-slate-800/50 rounded-xl animate-pulse"></span>
                ) : (villageData.village_description || 'Experience transparent governance, seamless digital services, and a thriving connected community right at your fingertips.')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up animate-delay-300 relative z-20">
                <Link href="/about" className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all duration-300 overflow-hidden w-full sm:w-auto text-center">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center justify-center gap-2">
                    Explore Our Village
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </Link>

                <Link href="/services" className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-emerald-500/50 font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm w-full sm:w-auto text-center flex items-center justify-center gap-2">
                  <span>Digital Services</span>
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-emerald-400 text-xs font-bold">→</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Interactive Visual */}
            <div className="hidden lg:block flex-1 relative perspective-1000 animate-fade-in-up animate-delay-300">
              <div className="relative w-full aspect-[4/3] max-w-[600px] mx-auto transform-style-3d hover:-rotate-y-6 transition-transform duration-1000 ease-out group">

                {/* Background glow layers */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/40 to-teal-400/40 rounded-[3rem] blur-3xl transform group-hover:scale-105 transition-transform duration-700" />

                {/* Image Container */}
                <div className="absolute inset-x-2 inset-y-4 bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transform transition-transform duration-700">
                  {/* The Dummy Village Image */}
                  <img
                    src={villageData.hero_image || "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"}
                    alt="Village overview"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20 mix-blend-multiply" />

                  {/* Overlays */}
                  <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Live Portal
                  </div>
                </div>

                {/* Floating Elements Over the Image */}
                <div className="absolute -top-8 -right-4 w-36 h-36 bg-emerald-500/20 backdrop-blur-2xl border border-emerald-400/30 rounded-full shadow-2xl flex items-center justify-center text-5xl transform translate-z-50 animate-pulse overflow-hidden" style={{ animationDuration: '4s' }}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
                  🏛️
                </div>

                <div className="absolute -bottom-6 -left-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-5 transform translate-z-50 delay-700 animate-pulse" style={{ animationDuration: '5s' }}>
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-2xl shadow-inner">👨‍🌾</div>
                    <div className="space-y-1">
                      <div className="text-white font-bold font-['Outfit'] text-lg">Active Community</div>
                      <div className="text-emerald-300 text-sm font-medium">Connect & Grow</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Stats Strip */}
        <div className="absolute bottom-[20px] left-0 right-0 z-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {loading ? (
                [1, 2, 3, 4].map((i) => <HomeStatCardSkeleton key={i} />)
              ) : (
                [
                  { label: 'Total Population', value: villageData.population, icon: '👥', trend: 'Growing', color: 'emerald' },
                  { label: 'Village Area', value: villageData.area, icon: '🗺️', trend: 'Stable', color: 'blue' },
                  { label: 'District', value: villageData.district, icon: '📍', trend: 'HQ', color: 'indigo' },
                  { label: 'State', value: villageData.state, icon: '🏛️', trend: 'IN', color: 'teal' },
                ].map((stat, i) => (
                <div key={stat.label}
                  className="relative group rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-4 sm:p-5 shadow-xl hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-transform duration-500 overflow-hidden"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-${stat.color}-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative flex flex-col items-start gap-2">
                    <div className="flex w-full items-start justify-between gap-1">
                      <div className={`w-10 h-10 shrink-0 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-inner border border-white/5`}>
                        {stat.icon}
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full bg-${stat.color}-500/20 text-${stat.color}-300 font-bold tracking-widest uppercase border border-${stat.color}-500/30 group-hover:bg-${stat.color}-500/30 transition-colors shrink-0 max-w-[80px] truncate block text-center`}>
                        {stat.trend}
                      </span>
                    </div>

                    <div className="mt-2 text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight break-words line-clamp-2 w-full bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-teal-100 transition-colors duration-300">
                      {stat.value}
                    </div>

                    <div className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                      {stat.label}
                    </div>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Ticker */}
      {loading ? (
        <AnnouncementSkeleton />
      ) : announcements.length > 0 && (
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
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-50 rounded-[100%] blur-3xl opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm mb-3 block">Citizen Services</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-['Outfit'] mb-4">
              What are you looking for?
            </h2>
            <p className="mt-3 text-gray-500 text-lg max-w-2xl mx-auto">Quick and easy access to all essential village services, information, and resources in one place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 hover-group">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(52,211,153,0.2)] transition-all duration-500 hover:-translate-y-2 overflow-hidden flex items-start gap-6"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150"></div>
                <div className="text-4xl p-4 bg-emerald-50 rounded-2xl group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-500 shadow-sm shrink-0 flex items-center justify-center">
                  {link.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Outfit'] group-hover:text-emerald-700 transition-colors">{link.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{link.desc}</p>
                </div>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sarpanch Message */}
      {villageData.sarpanch_name && (
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-900">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 sm:p-16 flex flex-col md:flex-row gap-12 items-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-teal-500/30 rounded-full blur-3xl"></div>

              <div className="shrink-0 relative z-10">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 p-2 shadow-2xl transform transition-transform hover:scale-105 duration-500">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-6xl shadow-inner border-4 border-white">
                    👤
                  </div>
                </div>
              </div>
              <div className="relative z-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold tracking-wider uppercase mb-6">
                  Message from the Sarpanch
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-['Outfit']">
                  {villageData.sarpanch_name}
                </h3>
                <div className="relative">
                  <span className="absolute -top-6 -left-8 text-6xl text-emerald-500/30 font-serif">&ldquo;</span>
                  <p className="text-emerald-50 text-xl sm:text-2xl leading-relaxed italic relative z-10 font-light">
                    {villageData.sarpanch_message || 'Welcome to our village website. Together we are building a stronger, more vibrant community for everyone.'}
                  </p>
                  <span className="absolute -bottom-8 -right-8 text-6xl text-emerald-500/30 font-serif leading-none">&rdquo;</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      {(loading || news.length > 0) && (
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
              <div>
                <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Updates & Announcements</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-['Outfit']">Latest News</h2>
              </div>
              <Link href="/news" className="group flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-900 font-semibold rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                View All News
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {loading ? (
                [1, 2, 3].map((i) => <HomeNewsCardSkeleton key={i} />)
              ) : (
                news.map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 flex flex-col">
                  <div className="h-56 bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center text-7xl transform group-hover:scale-110 transition-transform duration-500 opacity-80">
                      📰
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">News</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 font-['Outfit'] group-hover:text-emerald-600 transition-colors mb-4 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">{item.excerpt || item.content}</p>
                    <div className="text-emerald-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      Read full story <span className="text-lg">→</span>
                    </div>
                  </div>
                </Link>
              )))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {(loading || events.length > 0) && (
        <section className="py-24 bg-gray-50 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] opacity-30 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
              <div>
                <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Mark Your Calendar</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-['Outfit']">Upcoming Events</h2>
              </div>
              <Link href="/events" className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 font-semibold rounded-xl hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 transition-colors shadow-sm">
                All Events
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                [1, 2, 3].map((i) => <HomeEventCardSkeleton key={i} />)
              ) : (
                events.map((event) => {
                  const eventDate = new Date(event.event_date);
                return (
                  <div key={event.id} className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                    <div className="flex items-start gap-6">
                      <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 shadow-[0_8px_16px_-6px_rgba(52,211,153,0.4)] group-hover:shadow-[0_16px_32px_-12px_rgba(52,211,153,0.6)] transition-shadow duration-500">
                        <div className="w-full h-full bg-white rounded-[14px] flex flex-col items-center justify-center relative overflow-hidden">
                          <div className="absolute top-0 w-full h-6 bg-emerald-500/10"></div>
                          <span className="text-2xl font-bold text-gray-900 font-['Outfit'] leading-none mt-2">{eventDate.getDate()}</span>
                          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">{eventDate.toLocaleDateString('en-IN', { month: 'short' })}</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-['Outfit'] group-hover:text-emerald-600 transition-colors">{event.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{event.description}</p>
                        <div className="flex flex-col gap-2 text-xs font-medium text-gray-600">
                          {event.event_time && (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                              <span className="text-lg">🕐</span> {event.event_time}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                              <span className="text-lg">📍</span> {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }))}
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
