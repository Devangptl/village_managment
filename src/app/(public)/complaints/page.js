'use client';
import { useState } from 'react';

export default function ComplaintsPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', subject: '', description: '' });
      } else {
        setError('Failed to submit. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="gradient-hero pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-['Outfit']">File a Complaint</h1>
          <p className="text-emerald-100/80 text-xl">Your concerns matter to us. We&apos;re here to help.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="glass-card p-10 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Outfit']">Complaint Submitted!</h2>
              <p className="text-gray-500 mb-6">
                Thank you for reaching out. Your complaint has been registered and our team will review it shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary"
              >
                Submit Another Complaint
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Outfit']">Complaint Form</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="form-input"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="form-input"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="form-input"
                    placeholder="Brief subject of your complaint"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="form-input resize-none"
                    placeholder="Describe your complaint in detail..."
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5">
                  {submitting ? (
                    <><div className="spinner w-5 h-5 border-2 border-white/30 border-t-white" /> Submitting...</>
                  ) : (
                    <>📝 Submit Complaint</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
