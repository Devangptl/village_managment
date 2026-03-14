'use client';

import { useState, useEffect } from 'react';
import { EventCardSkeleton } from '@/components/Skeletons';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = events.filter((e) => e.event_date >= today);
  const past = events.filter((e) => e.event_date < today);

  const EventCard = ({ event }) => (
    <div className="glass-card p-6 flex gap-5 items-start">
      <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex flex-col items-center justify-center text-white shadow-lg">
        <span className="text-2xl font-bold leading-none">{new Date(event.event_date).getDate()}</span>
        <span className="text-xs uppercase tracking-wider">{new Date(event.event_date).toLocaleDateString('en-IN', { month: 'short' })}</span>
        <span className="text-[10px] opacity-70">{new Date(event.event_date).getFullYear()}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
          {event.event_time && (
            <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">🕐 {event.event_time}</span>
          )}
          {event.location && (
            <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">📍 {event.location}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className="gradient-hero pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-['Outfit']">Village Events</h1>
          <p className="text-emerald-100/80 text-xl">Community activities and celebrations</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <EventCardSkeleton key={i} />)}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-700">No events scheduled</h3>
              <p className="text-gray-400 mt-2">Check back soon for upcoming events!</p>
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Outfit'] flex items-center gap-3">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                    Upcoming Events
                  </h2>
                  <div className="space-y-4">
                    {upcoming.map((event) => <EventCard key={event.id} event={event} />)}
                  </div>
                </div>
              )}
              {past.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Outfit']">Past Events</h2>
                  <div className="space-y-4 opacity-70">
                    {past.map((event) => <EventCard key={event.id} event={event} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
