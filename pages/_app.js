import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(pageProps.user || null);
  const router = useRouter();

  // Log out function that can be called from anywhere in the app
  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setUser(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return <Component {...pageProps} user={user} setUser={setUser} logout={logout} />;
}

export default MyApp;