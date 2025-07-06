import React from 'react';

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg p-10 rounded-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-8">Welcome back</h1>
        <div className="flex flex-col space-y-4">
          <a href="http://localhost:5000/api/auth/google"
             className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full text-lg">
            Continue with Google
          </a>
          <a href="http://localhost:5000/api/auth/github"
             className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-full text-lg">
            Continue with GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
