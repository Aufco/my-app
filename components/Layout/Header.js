import Link from 'next/link';

export default function Header({ user, onLogout }) {
  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Language Learning Stories
        </Link>
        
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.username}</span>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link href="/" className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}