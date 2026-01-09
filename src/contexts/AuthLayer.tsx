import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../client/supabaseClient';

// interface Props {
//     children: ReactNode;
// }

function AuthLayer() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // 1. Check if a user is already logged in
        const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setLoading(false);
        };

        getUser();
    }, []);

  // 2. While checking the database, show nothing or a spinner
  if (loading) {
    return <div>Verifying access...</div>;
  }

  // 3. If no user found, boot them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 4. If user exists, show the protected content
  return <Outlet/>;
}

export default AuthLayer