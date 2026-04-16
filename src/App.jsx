import { useAuth } from './context/AuthContext';
import Login from './pages/Login';

function App() {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // 1. If not logged in, show Login Page
  if (!user) return <Login />;

  // 2. Section 2.1 Rule: If profile exists but is INACTIVE, block access
  if (profile?.record_status === 'INACTIVE') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white shadow-md rounded-xl max-w-sm">
          <h2 className="text-xl font-bold text-red-600">Account Pending</h2>
          <p className="mt-2 text-slate-600">
            Hi <strong>{profile.username}</strong>, your account is currently inactive. 
            Please contact a SUPERADMIN to activate your access.
          </p>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="mt-6 text-sm text-slate-400 hover:text-slate-600 underline"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // 3. If ACTIVE, show the App Shell (Sidebar, Navigation, etc.)
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar goes here */}
      <main className="flex-1 overflow-auto p-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Welcome, {profile?.firstName || profile?.username}</h1>
          <p className="text-slate-500">Role: <span className="font-mono text-blue-600">{profile?.user_type}</span></p>
        </header>
        
        {/* Content Pages based on hasRight() logic */}
      </main>
    </div>
  );
}

export default App;