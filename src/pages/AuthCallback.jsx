import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Section 4.6: Login Guard Implementation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Fetch the user's activation status from our custom 'user' table
        const { data: userRow, error: fetchError } = await supabase
          .from('user')
          .select('record_status, user_type, username, firstName, lastName')
          .eq('userId', session.user.id)
          .single();

        if (userRow?.record_status !== 'ACTIVE') {
          // Guard Triggered: Force sign out if not active
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          setError('Your account is pending activation by an administrator.');
        } else {
          // Account is active: Grant access
          setUser(session.user);
          setProfile(userRow);
          setError(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper to check permissions (Section 2.2)
  const hasRight = async (rightId) => {
    if (!user) return false;
    const { data } = await supabase
      .from('UserModule_Rights')
      .select('Right_value')
      .eq('userid', user.id)
      .eq('Right_ID', rightId)
      .single();
    return data?.Right_value === 1;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, hasRight }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);