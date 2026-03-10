import './globals.css';

export const metadata = {
  title: 'Jantralkampa - Official Website',
  description: 'Official website of Jantralkampa. Stay updated with news, events, services, and community information.',
  keywords: 'village, panchayat, Jantralkampa, community, government services',
  openGraph: {
    title: 'Jantralkampa - Official Website',
    description: 'Official website of Jantralkampa.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
