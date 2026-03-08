'use client';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [villageData, setVillageData] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetch('/api/village-data')
      .then((res) => res.json())
      .then((data) => setVillageData(data))
      .catch((err) => console.error('Failed to fetch village data', err));
  }, []);

  // Listen for login events from other tabs
  useEffect(() => {
    const bc = new BroadcastChannel('auth');
    bc.onmessage = (event) => {
      if (event.data === 'login') {
        router.push('/admin');
      }
    };
    return () => bc.close();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid username or password');
      setLoading(false);
    } else {
      // Notify all other open tabs about the login
      const bc = new BroadcastChannel('auth');
      bc.postMessage('login');
      bc.close();
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            {villageData?.village_logo && villageData?.show_dynamic_logo !== 'false' ? (
              <img
                src={villageData.village_logo}
                alt={villageData.village_name || 'Village Logo'}
                className="w-16 h-16 mx-auto mb-4 object-contain rounded-2xl bg-white/10 p-2 shadow-xl border border-gray-100"
              />
            ) : (
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-3xl shadow-xl">
                🏡
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900 font-['Outfit']">Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-1">{villageData?.village_name || 'Green Valley'} Panchayat</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? (
                <><div className="spinner w-5 h-5 border-2 border-white/30 border-t-white" /> Signing in...</>
              ) : (
                '🔐 Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Protected area. Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
