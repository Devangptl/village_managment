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
      // { href: 'tel:+912012345678', label: '+91 20 1234 5678' },
      // { href: 'mailto:contact@greenvalleyvillage.gov.in', label: 'Email Us' },
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
            <Link href="/" className="flex items-center gap-3 group pb-2">
              <div className="logo-flow-container">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md transition-all duration-500 border-2 border-white/20 overflow-hidden">
                  <img
                    src={"/images/logo.png"}
                    alt={'Jantralkampa'}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className={`font-extrabold text-lg lg:text-xl tracking-tight font-['Outfit'] transition-colors duration-300`}>
                  {'Jantralkampa'}
                </span>
              </div>
            </Link>

            <div className="flex gap-3 mt-6">
              {[
                {
                  href: 'https://www.instagram.com/jantralkampa?igsh=MTkydXRwamIwNng2Mw==',
                  label: 'Instagram',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  ),
                  color: 'hover:text-pink-500 hover:bg-pink-500/10'
                },
                {
                  href: 'https://www.youtube.com/@jantralKampaofficial',
                  label: 'YouTube',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 103.8 103.8 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 103.8 103.8 0 0 1-15 0 2 2 0 0 1-2-2z" /><path d="m10 15 5-3-5-3z" /></svg>
                  ),
                  color: 'hover:text-red-500 hover:bg-red-500/10'
                }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-400 transition-all duration-300 border border-gray-700/50 ${social.color} hover:scale-110 hover:border-current shadow-lg shadow-black/20`}
                  aria-label={social.label}
                >
                  {social.icon}
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
            © {new Date().getFullYear()} Jantralkampa. All rights reserved.
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
