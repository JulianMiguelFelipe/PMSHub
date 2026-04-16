import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { error: guardError } = useAuth(); // Error from Section 4.6 guard
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Form Fields based on Section 4.2
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: ''
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    if (isRegistering) {
      // 4.2 Email/Password Registration
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setLocalError(error.message);
      else alert('Check your email for the confirmation link!');
    } else {
      // Standard Login
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) setLocalError(error.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    // 4.3 Google OAuth Implementation
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { hd: 'neu.edu.ph' } 
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Hope, Inc.</h1>
          <p className="text-slate-500 text-sm font-medium tracking-wide uppercase">
            {isRegistering ? 'Account Registration' : 'System Access'}
          </p>
        </header>

        {/* Display Guard or Local Errors */}
        {(guardError || localError) && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {guardError || localError}
          </div>
        )}

        {/* Section 4.8 Button Layout (Email/Password) */}
        <form onSubmit={handleAuth} className="flex flex-col gap-3">
          {isRegistering && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="First Name" required className="p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                <input type="text" placeholder="Last Name" required className="p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <input type="text" placeholder="Username" required className="p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e) => setFormData({...formData, username: e.target.value})} />
            </>
          )}

          <input type="email" placeholder="Email" required className="p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          
          <input type="password" placeholder="Password" required className="p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} />

          <button type="submit" disabled={loading} className="mt-2 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition active:scale-95 disabled:opacity-50">
            {loading ? 'Processing...' : isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {/* Section 4.8 Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3 text-xs text-slate-400 font-bold">OR</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        {/* Section 4.8 Google OAuth Button */}
        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 border border-slate-300 py-2.5 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google icon" />
          Sign in with Google
        </button>

        <footer className="mt-8 text-center text-sm text-slate-600 font-medium">
          {isRegistering ? 'Already registered?' : 'Need an account?'} 
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="ml-2 text-blue-600 hover:underline font-bold"
          >
            {isRegistering ? 'Sign In' : 'Register Now'}
          </button>
        </footer>
      </div>
    </div>
  );
}