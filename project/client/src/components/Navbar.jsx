import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../calls/authCalls';
import { setUserData } from '../redux/userSlice';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../calls/config';

import { Layout, Input, Button, Avatar, Typography, Space } from 'antd';
import { UserOutlined, LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Navbar.css';
// import { getAllMovies } from '../calls/movieCalls';
// import { useState } from 'react';

const { Header } = Layout;
const { Text } = Typography;

function Navbar() {

  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); //added

  // useEffect(() => {
  //   (async () => {
  //     const user = await getCurrentUser();
  //   //   const movies = await getAllMovies();
  //   //    setMovies(movies.data)
  //     dispatch(setUserData(user || null));
  //   })();
  // }, []);

  const onSearch = (value) => {
    console.log("Search:", value);
  };

//   const onLogout = () => {
//     // localStorage.removeItem('token');
//     // document.cookie = "jwtToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
//     // await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
//     dispatch(setUserData(null));
//   };

    const onLogout = async () => {
    try {
      // Call logout API to clear the cookie on server
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      
      // Clear Redux state
      dispatch(setUserData(null));
      
      // Navigate to login
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API fails, clear local state and redirect
      dispatch(setUserData(null));
      navigate('/login');
    }
  };

  const displayName = userData?.name || userData?.username || "User";

  return (
    <Layout>
      <Header className="navbar-header">
        <div className="navbar-content">
          <Link 
            to={userData?.role === 'partner' ? "/partner" : userData?.role === 'admin' ? '/admin' : '/home'} 
            className="navbar-brand"
          >
            <Text strong className="brand-text">MovieHub</Text>
          </Link>

          <div className="navbar-search">
            <Input
              placeholder="Search movies..."
              onPressEnter={(e) => onSearch(e.target.value)}
              className="search-input"
              prefix={<SearchOutlined />}
            />
          </div>

          <div className="navbar-actions">
            {userData?.role === 'user' && (
              <Link to="/my-bookings">
                <Button type="link" className="nav-link">My Bookings</Button>
              </Link>
            )}
            <div className="user-info">
              <Avatar icon={<UserOutlined />} className="user-avatar" />
              <Text className="user-name">{displayName}</Text>
            </div>
            <Button 
              icon={<LogoutOutlined />} 
              onClick={onLogout} 
              className="logout-button"
            >
              Logout
            </Button>
          </div>
        </div>
      </Header>
    </Layout>
  );
}

export default Navbar;