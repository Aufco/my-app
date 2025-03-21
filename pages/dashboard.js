import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import StoryDisplay from '../components/Story/StoryDisplay';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on component mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          } else {
            router.push('/');
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-700">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Your Stories
        </h1>
        
        <StoryDisplay />
      </div>
    </Layout>
  );
}