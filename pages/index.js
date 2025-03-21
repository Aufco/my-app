import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

export default function Home({ user }) {
  const [showLogin, setShowLogin] = useState(true);
  const router = useRouter();

  // If user is already logged in, redirect to dashboard
  if (user) {
    router.push('/dashboard');
    return null;
  }

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Welcome to Spanish Stories
        </h1>
        
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowLogin(true)}
            className={`px-6 py-2 ${
              showLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-l`}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={`px-6 py-2 ${
              !showLogin ? 'bg-green-500 text-white' : 'bg-gray-200'
            } rounded-r`}
          >
            Create Account
          </button>
        </div>
        
        {showLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </Layout>
  );
}