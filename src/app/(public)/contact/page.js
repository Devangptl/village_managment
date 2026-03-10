'use client';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [villageData, setVillageData] = useState({});

  useEffect(() => {
    fetch('/api/village-data')
      .then((res) => res.json())
      .then(setVillageData)
      .catch(() => { });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setError('Failed to send. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: '📍', label: 'Address', value: villageData.village_address || 'Jantralkampa, Pune' },
    { icon: '📞', label: 'Phone', value: villageData.village_phone || '+91 20 1234 5678' },
    { icon: '📧', label: 'Email', value: villageData.village_email || 'contact@greenvalleyvillage.gov.in' },
  ];

  return (
    <>
      <section className="gradient-hero pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-['Outfit']">Contact Us</h1>
          <p className="text-emerald-100/80 text-xl">We&apos;d love to hear from you</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              {submitted ? (
                <div className="glass-card p-10 text-center">
                  <div className="text-6xl mb-4">✉️</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Outfit']">Message Sent!</h2>
                  <p className="text-gray-500 mb-6">Thank you for contacting us. We&apos;ll get back to you soon.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Outfit']">Send a Message</h2>
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>
                  )}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                      <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="form-input" placeholder="Subject line" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                      <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="form-input resize-none" placeholder="Your message..." />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5">
                      {submitting ? 'Sending...' : '📨 Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Contact Info + Map */}
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="glass-card p-6 flex items-start gap-4">
                  <div className="text-2xl">{info.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{info.label}</h3>
                    <p className="text-gray-600 text-sm mt-0.5">{info.value}</p>
                  </div>
                </div>
              ))}

              {/* Map */}
              <div className="glass-card overflow-hidden h-72">
                {villageData.map_embed ? (
                  <iframe
                    src={villageData.map_embed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Village Location"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-2">🗺️</div>
                      <p className="text-gray-500 text-sm">Map will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
