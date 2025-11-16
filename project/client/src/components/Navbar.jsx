import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../calls/authCalls';
import { setUserData } from '../redux/userSlice';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../calls/config';

import { Layout, Input, Button, Avatar, Typography, Space } from 'antd';
import { UserOutlined, LogoutOutlined, SearchOutlined } from '@ant-design/icons';
// import { getAllMovies } from '../calls/movieCalls';
// import { useState } from 'react';

const { Header } = Layout;
const { Text } = Typography;

function Home() {

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
      <Header style={{ background: "rgb(235, 78, 98)", display: "flex", alignItems: "center", padding: "0 20px" }}>
        
        {/* Logo / Brand */}
        <Text strong style={{ fontSize: 18 }}>MyApp</Text>

        {/* Search Bar */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "0 20px" }}>
          <Input
            placeholder="Search..."
            onPressEnter={(e) => onSearch(e.target.value)}
            style={{ maxWidth: 400 }}
            prefix={<SearchOutlined />}
          />
        </div>

        {/* User Info + Logout */}
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text>{displayName}</Text>
          <Button icon={<LogoutOutlined />} onClick={onLogout} type="default">
            Logout
          </Button>
        </Space>
      </Header>

      <div style={{ padding: 20 }}>
        {/* Page content */}
      </div>
    </Layout>
  );
}

export default Home;