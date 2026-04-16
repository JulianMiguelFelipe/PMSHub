import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // This should match the redirect URI you set in Supabase/Vercel
          redirectTo: window.location.origin, 
          // Suggest NEU emails specifically
          queryParams: {
            hd: 'neu.edu.ph', 
          },
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Hope, Inc.</h1>
        <p className="text-slate-500 mb-8 text-sm uppercase tracking-widest font-semibold">
          Product Management System
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 py-3 px-4 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-800"></span>
          ) : (
            <>
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-5 h-5"
              />
              Sign in with NEU Email
            </>
          )}
        </button>

        <p className="mt-8 text-xs text-slate-400">
          New Era University - BS Information Technology<br />
          Project Development Guide Rev. 3
        </p>
      </div>
    </div>
  );
}