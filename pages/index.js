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
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome to Language Learning Stories
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">About the 85-95% Rule</h2>
          <p className="mb-4 text-gray-700">
            The 85-95% comprehension rule is a key principle in language acquisition. Ideally, 
            learning materials should contain 85-95% vocabulary that you already understand. 
            This creates the perfect balance where content is challenging enough to be engaging 
            but accessible enough to learn from context.
          </p>
          <p className="mb-4 text-gray-700">
            With Language Learning Stories, we help you stay in this optimal learning zone by:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">Generating stories in your target language</li>
            <li className="mb-2">Allowing you to highlight difficult words</li>
            <li className="mb-2">Measuring your comprehension level</li>
            <li className="mb-2">Regenerating stories with simpler language when needed</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">For New Users</h3>
          <p className="mb-4 text-gray-700">
            Create an account to get started. Once logged in, select your target language and 
            generate your first story. Click on unfamiliar words to highlight them, and if your 
            comprehension drops below 85%, use the "Regenerate Story" button for a simpler version.
          </p>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">For Returning Users</h3>
          <p className="text-gray-700">
            Log in to continue building your vocabulary. Your previously highlighted words are saved 
            so you can track your progress over time.
          </p>
        </div>
        
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowLogin(true)}
            className={`px-6 py-2 ${
              showLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            } rounded-l`}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={`px-6 py-2 ${
              !showLogin ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
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