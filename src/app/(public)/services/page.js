import { getBaseUrl } from '@/lib/api';

export const metadata = {
  title: 'Services - Jantralkampa',
  description: 'Government services and schemes available at Jantralkampa Panchayat.',
};

async function getServices() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/services`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  // Group by department
  const departments = {};
  services.forEach((s) => {
    const dept = s.department || 'General';
    if (!departments[dept]) departments[dept] = [];
    departments[dept].push(s);
  });

  return (
    <>
      <section className="gradient-hero pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-['Outfit']">Village Services</h1>
          <p className="text-emerald-100/80 text-xl">Government services and schemes at your fingertips</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold text-gray-700">No services listed yet</h3>
              <p className="text-gray-400 mt-2">Services will be updated soon!</p>
            </div>
          ) : (
            Object.entries(departments).map(([dept, items]) => (
              <div key={dept} className="mb-12 last:mb-0">
                <h2 className="text-xl font-bold text-gray-800 mb-6 font-['Outfit'] flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  {dept}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((service) => (
                    <div key={service.id} className="glass-card p-6 group">
                      <div className="text-3xl mb-3">{service.icon || '🏛️'}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3">{service.description}</p>
                      {service.contact_info && (
                        <div className="text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
                          📞 {service.contact_info}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
