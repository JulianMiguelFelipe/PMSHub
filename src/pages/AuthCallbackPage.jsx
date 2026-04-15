import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Guard: check if the user is active [cite: 547, 560]
        const { data: userRow } = await supabase
          .from('user')
          .select('record_status')
          .eq('userId', session.user.id)
          .single();

        if (userRow?.record_status === 'ACTIVE') {
          navigate('/products');
        } else {
          await supabase.auth.signOut();
          navigate('/login?error=not_activated');
        }
      }
    });
  }, [navigate]);

  return <div className="h-screen flex items-center justify-center">Authenticating...</div>;
}