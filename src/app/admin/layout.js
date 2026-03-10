'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import { useState, useEffect } from 'react';

const sidebarLinks = [
  { href: '/admin', icon: '📊', label: 'Dashboard' },
  { href: '/admin/news', icon: '📰', label: 'News' },
  { href: '/admin/events', icon: '📅', label: 'Events' },
  { href: '/admin/gallery', icon: '📸', label: 'Gallery' },
  { href: '/admin/services', icon: '🏛️', label: 'Services' },
  { href: '/admin/directory', icon: '📖', label: 'Directory' },
  { href: '/admin/complaints', icon: '📝', label: 'Complaints' },
  { href: '/admin/announcements', icon: '📢', label: 'Announcements' },
  { href: '/admin/village-data', icon: '🏘️', label: 'Village Data' },
  { href: '/admin/messages', icon: '✉️', label: 'Messages' },
  { href: '/admin/family-tree', icon: '👨‍👩‍👧‍👦', label: 'Family Tree' },
];

function AdminSidebar({ isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [villageData, setVillageData] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetch('/api/village-data')
      .then((res) => res.json())
      .then((data) => setVillageData(data))
      .catch((err) => console.error('Failed to fetch village data', err));
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      });

      // Notify all other open tabs to logout
      const bc = new BroadcastChannel('auth');
      bc.postMessage('logout');
      bc.close();

      router.push("/admin/login");
    } catch (error) {
      setError("Something went wrong");
    }
  };
  return (
    <aside className={`admin-sidebar text-white flex flex-col transition-all duration-300 ${collapsed ? 'lg:w-20 w-64' : 'w-64'} h-screen fixed lg:sticky top-0 left-0 z-50 ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:shadow-none'}`}>
      {/* Mobile Close Button */}
      <button
        onClick={() => setIsMobileOpen(false)}
        className="lg:hidden absolute top-4 right-4 p-2 text-white/70 hover:text-white focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          {villageData?.village_logo && villageData?.show_dynamic_logo !== 'false' ? (
            <img
              src={villageData.village_logo}
              alt={villageData.village_name || 'Village Logo'}
              className="w-10 h-10 object-contain rounded-xl bg-white/20 p-1 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">
              🏡
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-bold text-sm font-['Outfit'] block truncate">
                {villageData?.village_name || 'Jantralkampa'}
              </span>
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider">Admin Panel</span>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${(link.href === '/admin' && pathname === '/admin') ||
                (link.href !== '/admin' && pathname.startsWith(link.href))
                ? 'bg-white/15 text-white border-l-3 border-emerald-300'
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
          >
            <span className="text-lg shrink-0">{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {!collapsed && session?.user && (
          <div className="mb-3 text-xs text-emerald-200 truncate">
            👤 {session.user.name}
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block flex-1 px-3 py-2 rounded-lg bg-white/10 text-white/70 hover:text-white text-xs transition-all"
          >
            {collapsed ? '→' : '← Collapse'}
          </button>
          {!collapsed && (
            <button
              onClick={() => handleLogout()}
              className="px-3 py-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 text-xs transition-all"
            >
              Logout
            </button>
          )}
        </div>
        {!collapsed && (
          <Link href="/" className="block mt-2 text-center text-xs text-emerald-300 hover:text-white transition-colors">
            ← Back to Website
          </Link>
        )}
      </div>
    </aside>
  );
}

function AdminLayoutInner({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Listen for logout events from other tabs
  useEffect(() => {
    const bc = new BroadcastChannel('auth');
    bc.onmessage = (event) => {
      if (event.data === 'logout') {
        router.push('/admin/login');
      }
    };
    return () => bc.close();
  }, [router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') return children;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header indicator */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-30 shadow-sm">
          <div className="font-bold text-emerald-800 text-lg">Admin Panel</div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -mr-2 text-gray-600 hover:bg-emerald-50 rounded-lg transition-colors focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
