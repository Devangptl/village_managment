'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/news', label: 'News' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/services', label: 'Services' },
  { href: '/directory', label: 'Directory' },
  { href: '/complaints', label: 'Complaints' },
  { href: '/family-tree', label: 'Family Tree' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [villageData, setVillageData] = useState({});
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/village-data')
      .then((res) => res.json())
      .then((data) => setVillageData(data))
      .catch((err) => console.error('Failed to fetch village data', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${scrolled
            ? 'h-16 px-3 bg-white/60 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full'
            : 'h-16 bg-transparent rounded-full border-none'
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group pl-2">
            {villageData?.village_logo && villageData?.show_dynamic_logo !== 'false' ? (
              <img
                src={villageData.village_logo}
                alt={villageData.village_name || 'Village Logo'}
                className="w-10 h-10 lg:w-11 lg:h-11 object-contain rounded-full shadow-md group-hover:scale-110 transition-transform duration-500 bg-white/90 p-1 border border-white/50"
              />
            ) : (
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-2 border-white/20">
                🏡
              </div>
            )}
            <div className="flex flex-col justify-center">
              <span className={`font-extrabold text-lg lg:text-xl tracking-tight font-['Outfit'] transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                {villageData?.village_name || 'Jantralkampa'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1.5 pr-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 group overflow-hidden ${isActive
                    ? scrolled
                      ? 'text-emerald-700 bg-emerald-50/80 shadow-sm border border-emerald-100/50'
                      : 'text-emerald-900 bg-white/90 shadow-lg border border-white/20'
                    : scrolled
                      ? 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                      : 'text-white/90 hover:text-emerald-900 hover:bg-white/90'
                    }`}
                >
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-full transition-colors mr-1 ${scrolled ? 'text-gray-700 hover:bg-gray-100/80' : 'text-white hover:bg-white/20 backdrop-blur-sm'
              }`}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden absolute top-[calc(100%+0.5rem)] left-4 right-4 transition-all duration-500 overflow-hidden rounded-3xl ${isOpen ? 'max-h-[500px] opacity-100 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/40' : 'max-h-0 opacity-0 border-transparent shadow-none'
          }`}
      >
        <div className="bg-white/95 backdrop-blur-xl px-2 py-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
