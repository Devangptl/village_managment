import './globals.css';

export const metadata = {
  title: 'Green Valley Village - Official Website',
  description: 'Official website of Green Valley Village. Stay updated with news, events, services, and community information.',
  keywords: 'village, panchayat, green valley, community, government services',
  openGraph: {
    title: 'Green Valley Village - Official Website',
    description: 'Official website of Green Valley Village.',
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
