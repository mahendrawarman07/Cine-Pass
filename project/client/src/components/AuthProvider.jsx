import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../calls/authCalls';
import { setUserData} from '../redux/userSlice';

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Function to verify authentication
    const verifyAuth = async () => {
      try {
        // dispatch(setLoading(true));
        const user = await getCurrentUser();
        
        // If user data exists, set it
        if (user) {
          dispatch(setUserData(user));
        } else {
          // No user, stop loading
        //   dispatch(setLoading(false));
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        // dispatch(setLoading(false));
      }
    };

    verifyAuth();
  }, [dispatch]);

  return children;
}

export default AuthProvider;