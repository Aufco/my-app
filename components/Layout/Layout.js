import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from './Header';

export default function Layout({ children, user }) {
  const router = useRouter();

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Language Learning Stories</title>
        <meta name="description" content="Adaptive AI-Generated Language Learning Stories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header user={user} onLogout={handleLogout} />

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>Adaptive AI-Generated Language Learning Stories - Local App</p>
        </div>
      </footer>
    </div>
  );
}