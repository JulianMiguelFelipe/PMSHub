import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [permissions, setPermissions] = useState([]); // Holds UserModule_Rights
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session);
    });

    // 2. Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = async (session) => {
    if (session?.user) {
      setUser(session.user);
      await fetchUserData(session.user.id);
    } else {
      setUser(null);
      setProfile(null);
      setPermissions([]);
      setLoading(false);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      // Fetch profile (to get user_type and record_status)
      const { data: profileData } = await supabase
        .from('user')
        .select('*')
        .eq('userId', userId)
        .single();

      // Fetch specific rights (UserModule_Rights table)
      const { data: rightsData } = await supabase
        .from('UserModule_Rights')
        .select('Right_ID, Right_value')
        .eq('userid', userId)
        .eq('Record_status', 'ACTIVE');

      setProfile(profileData);
      setPermissions(rightsData || []);
    } catch (error) {
      console.error('Error fetching auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check specific rights in components
  const hasRight = (rightId) => {
    return permissions.some(p => p.Right_ID === rightId && p.Right_value === 1);
  };

  return (
    <AuthContext.Provider value={{ user, profile, permissions, hasRight, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);