import Link from 'next/link';

const footerLinks = [
  {
    title: 'Quick Links',
    links: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About Village' },
      { href: '/news', label: 'Latest News' },
      { href: '/events', label: 'Events' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/services', label: 'Government Services' },
      { href: '/directory', label: 'Village Directory' },
      { href: '/complaints', label: 'File Complaint' },
      { href: '/gallery', label: 'Photo Gallery' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { href: '/contact', label: 'Contact Us' },
      { href: 'tel:+912012345678', label: '+91 20 1234 5678' },
      { href: 'mailto:contact@greenvalleyvillage.gov.in', label: 'Email Us' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                🏡
              </div>
              <div>
                <span className="font-bold text-lg font-['Outfit']">Jantralkampa</span>
                <span className="block text-[10px] font-medium tracking-widest uppercase text-emerald-400">
                  Village Panchayat
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Dedicated to sustainable development, transparency, and the well-being of every resident.
            </p>
            <div className="flex gap-3 mt-6">
              {['facebook', 'twitter', 'instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-emerald-600 transition-colors text-sm"
                >
                  {social === 'facebook' && 'f'}
                  {social === 'twitter' && '𝕏'}
                  {social === 'instagram' && '📷'}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-emerald-400 text-sm uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Jantralkampa Panchayat. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/admin/login" className="text-gray-500 hover:text-emerald-400 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
