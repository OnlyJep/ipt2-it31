import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Layout, Dropdown, Badge, Input, Row, Col, message, List } from "antd";
import { BellFilled, DownOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom"; 
import Logoff from '../../../private/dashboard/logoff'; 
import HeadNavList from './HeaderNavList'; 
import DefaultPic from '../../../../../../storage/app/public/default/default.png';

const { Header: AntHeader } = Layout;
const { Search } = Input; 

const Header = ({ style, toggleSidebar, toggleMobileSidebar }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]); // Changed to array
  const [scrolled, setScrolled] = useState(false); 
  const [isSearching, setIsSearching] = useState(false); 
  const [filteredRecommendations, setFilteredRecommendations] = useState([]); 
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileId = localStorage.getItem('profile_id');
        if (!profileId) {
          message.error('Profile ID not found. Please log in again.');
          navigate('/login'); // Redirect to login if profile ID is missing
          return;
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
          message.error('No token found. Please log in.');
          navigate('/login'); // Redirect to login if token is missing
          return;
        }

        const response = await axios.get(`/api/profiles/${profileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data); 
        setNotifications(response.data.notifications || []); // Assuming notifications is an array

      } catch (error) {
        console.error(error);
        message.error('Failed to load profile data');
        // Optionally, log the user out if the token is invalid
        localStorage.removeItem('auth_token');
        localStorage.removeItem('profile_id');
        navigate('/login');
      }
    };

    fetchProfileData();
  }, [navigate]); 

  const recommendations = [
    { label: "Dashboard", route: `/superadmin/dashboard` },
    { label: "Users", route: `/superadmin/users` },
    { label: "Faculty IS", route: `/superadmin/faculty-is` },
    { label: "Student IS", route: `/superadmin/student-is` },
    { label: "Class Scheduling", route: `/superadmin/class-scheduling` },
    { label: "Academic Programs", route: `/superadmin/academic-programs` },
    { label: "Subject Enlistment", route: `/superadmin/subject-enlistment` },
    { label: "Classroom Manager", route: `/superadmin/classroom-manager` },
    { label: "System Settings > Facilities Manager", route: `/system-settings/facilities-manager` },
    { label: "System Settings > Programs Management", route: `/system-settings/programs-management` },
    { label: "System Settings > Terms Management", route: `/system-settings/terms-management` },
    { label: "System Settings > Posting Management", route: `/system-settings/posting-management` },
  ];

  const currentPath = location.pathname; 

  const getCurrentSection = () => {
    const matchedItem = recommendations.find((item) => currentPath.startsWith(item.route));
    return matchedItem ? matchedItem.label : null;
  };

  const currentSection = getCurrentSection(); 

  const filteredRecommendationsForSearch = recommendations.filter(
    (item) => item.label !== currentSection
  );

  const debounce = (func, delay) => {
    let debounceTimer;
    return function(...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleSearch = async (value) => {
    const trimmedValue = value.trim().toLowerCase(); // Ensure no leading/trailing spaces and make it lowercase

    if (!trimmedValue) {
      message.warning('Please enter a search term.');
      return;
    }

    const matchedRecommendation = filteredRecommendationsForSearch.find(
      (item) => item.label.toLowerCase().includes(trimmedValue) // Match part of the label
    );

    if (matchedRecommendation) {
      navigate(matchedRecommendation.route); // Navigate to the matched route
    } else {
      message.info('No matching section found.');
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [filteredRecommendationsForSearch, user]);

  const onSearch = (value) => {
    debouncedSearch(value);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.trim().toLowerCase();
    if (value) {
      const filtered = filteredRecommendationsForSearch.filter((item) =>
        item.label.toLowerCase().includes(value) // Check if search term is anywhere in the label
      );
      setFilteredRecommendations(filtered);
    } else {
      setFilteredRecommendations([]);
    }
  };

  // Define the notification dropdown menu with enhanced styles
  const notificationMenu = (
    <div
      style={{
        padding: '16px',
        width: '300px',
        backgroundColor: '#ffffff', // White background
        borderRadius: '8px',        // Rounded corners
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
      }}
    >
      <h4 style={{ marginBottom: '16px', textAlign: 'center', color: '#333' }}>Notifications</h4>
      {notifications.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
          style={{ maxHeight: '300px', overflowY: 'auto' }} // Scroll if too many notifications
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ color: '#888' }}>No notifications found.</p>
        </div>
      )}
    </div>
  );

  return (
    <AntHeader className={`header ${scrolled ? 'scrolled' : ''}`} style={style}>
      <div className="header-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div className="menu-icon" onClick={toggleMobileSidebar} style={{ marginRight: '20px' }}>
            <MenuOutlined style={{ fontSize: '24px', color: '#3f7afc' }} />
          </div>

          <div className="search-bar" style={{ position: 'relative', flexGrow: 1, marginLeft: '50px', marginTop: '30px' }}>
            <Row gutter={16}>
              <Col xs={20} sm={18} md={12} lg={14} xl={12}>
                <Input.Search
                  placeholder="Search..."
                  onSearch={onSearch}
                  onChange={handleInputChange}
                  enterButton
                  allowClear
                  loading={isSearching}
                  style={{ width: '110%' }}
                />
                {filteredRecommendations.length > 0 && (
                  <List
                    size="small"
                    bordered
                    dataSource={filteredRecommendations}
                    renderItem={(item) => (
                      <List.Item
                        onClick={() => navigate(item.route)}
                        style={{ cursor: 'pointer' }}
                      >
                        {item.label}
                      </List.Item>
                    )}
                    style={{
                      position: 'absolute',
                      top: '40px',
                      width: '100%',
                      backgroundColor: '#fff',
                      zIndex: 1000,
                      maxHeight: '200px',
                      overflowY: 'auto',
                    }}
                  />
                )}
              </Col>
            </Row>
          </div>
        </div>

        <div className="header-right" style={{ display: "flex", alignItems: "center", paddingRight: '20px' }}>
          {/* Notification Dropdown */}
          <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
            <Badge count={notifications.length} offset={[10, 0]}>
              <BellFilled style={{ fontSize: '22px', marginRight: '20px', cursor: 'pointer', color: '#3f7afc' }} />
            </Badge>
          </Dropdown>

          {/* Profile Dropdown */}
          <Dropdown overlay={<HeadNavList userRole={user?.role} navigate={navigate} logout={Logoff} />} placement="bottomRight">
            <div style={{ display: "flex", alignItems: "center", cursor: 'pointer' }}>
              <img
                src={user?.photo_path ? `/storage/${user.photo_path}` : DefaultPic} 
                alt="Profile"
                style={{
                  width: '40px', 
                  height: '40px',
                  borderRadius: '50%', 
                  marginRight: '8px',
                }}
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop if default image fails
                  e.target.src = DefaultPic; // Fallback to default image
                }}
              />
              <DownOutlined style={{ fontSize: '16px', color: '#3f7afc' }} />
            </div>
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
