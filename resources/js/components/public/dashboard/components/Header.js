import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Layout, Dropdown, Badge, Input, Row, Col, message, Spin, List } from "antd";
import { BellFilled, DownOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { logout } from '../../../private/dashboard/logoff'; // Import the logout function
import HeadNavList from './HeaderNavList'; // Import the new HeadNavList component

const { Header: AntHeader } = Layout;
const { Search } = Input; // Import Search component from Ant Design

const Header = ({ style, toggleSidebar, toggleMobileSidebar }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [scrolled, setScrolled] = useState(false); // State to track scroll position
  const [isLoading, setIsLoading] = useState(true); // To handle loading state
  const [isSearching, setIsSearching] = useState(false); // To handle search loading state
  const [searchResults, setSearchResults] = useState([]); // To store search results
  const [filteredRecommendations, setFilteredRecommendations] = useState([]); // For search suggestions
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const profileId = localStorage.getItem('profile_id');
        if (!profileId) {
          message.error('Profile ID not found. Please log in again.');
          return;
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
          message.error('No token found. Please log in.');
          return;
        }

        const response = await axios.get(`/api/profiles/${profileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data); // Set the user data, which includes photo_path
        setNotifications(response.data.notifications || 0); // Set notifications if available

      } catch (error) {
        console.error(error);
        message.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Recommendation array
  const recommendations = [
    { label: "Dashboard", route: `/superadmin/dashboard` },
    { label: "Users", route: `/superadmin/users` },
    { label: "Faculty IS", route: `/superadmin/faculty-is` },
    { label: "Student IS", route: `/superadmin/student-is` },
    { label: "Class Scheduling", route: `/superadmin/class-scheduling` },
    { label: "Academic Programs", route: `/superadmin/academic-programs` },
    { label: "Subject Enlistment", route: `/superadmin/subject-enlistment` },
    { label: "Classroom Manager", route: `/superadmin/classroom-manager` },
    { label: "Sytem Settings > Facilities Manager", route: `/system-settings/facilities-manager` },
    { label: "System Settings > Programs Management", route: `/system-settings/programs-management` },
    { label: "System Settings > Terms Management", route: `/system-settings/terms-management` },
    { label: "System Settings > Posting Management", route: `/system-settings/posting-management` },
  ];

  const currentPath = location.pathname; // Current pathname

  // Function to find the current section based on pathname
  const getCurrentSection = () => {
    const matchedItem = recommendations.find((item) => currentPath.startsWith(item.route));
    return matchedItem ? matchedItem.label : null;
  };

  const currentSection = getCurrentSection(); // Current section label

  // Filtered recommendations for search suggestions (excluding current section)
  const filteredRecommendationsForSearch = recommendations.filter(
    (item) => item.label !== currentSection
  );

  // Debounce function to limit the rate of API calls or handling input
  const debounce = (func, delay) => {
    let debounceTimer;
    return function(...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  // Enhanced onSearch function with navigation based on recommendations
  const handleSearch = async (value) => {
    const trimmedValue = value.trim().toLowerCase();

    if (!trimmedValue) {
      message.warning('Please enter a search term.');
      return;
    }

    // Find a recommendation that matches the search query (case-insensitive)
    const matchedRecommendation = filteredRecommendationsForSearch.find(
      (item) => item.label.toLowerCase() === trimmedValue
    );

    if (matchedRecommendation) {
      // Navigate to the matched route
      navigate(matchedRecommendation.route);
    } else {
      // Optionally handle cases where no exact match is found
      message.info('No matching section found.');
      // Alternatively, perform a default search or navigate to a general search page
      // navigate(`/search?query=${encodeURIComponent(value)}`);
    }
  };

  // Wrap handleSearch with debounce to delay handling
  const debouncedSearch = useCallback(debounce(handleSearch, 300), [filteredRecommendationsForSearch, user]);

  const onSearch = (value) => {
    debouncedSearch(value);
  };

  // Handle input change for suggestions
  const handleInputChange = (e) => {
    const value = e.target.value.trim().toLowerCase();
    if (value) {
      const filtered = filteredRecommendationsForSearch.filter((item) =>
        item.label.toLowerCase().startsWith(value)
      );
      setFilteredRecommendations(filtered);
    } else {
      setFilteredRecommendations([]);
    }
  };

  const handleSelect = (label) => {
    const selected = recommendations.find(
      (item) => item.label.toLowerCase() === label.toLowerCase()
    );
    if (selected) {
      navigate(selected.route);
    }
    setFilteredRecommendations([]);
  };

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AntHeader
      className={`header ${scrolled ? 'scrolled' : ''}`}
      style={style}
    >
      <div className="header-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        {/* Left side of the header */}
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {/* Hamburger Button for Mobile */}
          <div className="menu-icon" onClick={toggleMobileSidebar} style={{ marginRight: '20px' }}>
            <MenuOutlined style={{ fontSize: '24px', color: '#3f7afc' }} />
          </div>

          {/* Search Bar */}
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
                {/* Search Suggestions */}
                {filteredRecommendations.length > 0 && (
                  <List
                    size="small"
                    bordered
                    dataSource={filteredRecommendations}
                    renderItem={(item) => (
                      <List.Item
                        onClick={() => handleSelect(item.label)}
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

        {/* Right side of the header */}
        <div className="header-right" style={{ display: "flex", alignItems: "center", paddingRight: '20px' }}>
          {/* Notification Icon with Badge */}
          <Badge count={notifications} offset={[10, 0]}>
            <BellFilled style={{ fontSize: '22px', marginRight: '20px', cursor: 'pointer', color: '#3f7afc' }} />
          </Badge>

          {/* User Profile Image with Dropdown */}
          <Dropdown overlay={<HeadNavList userRole={user?.role} navigate={navigate} logout={logout} />} placement="bottomRight">
            <div style={{ display: "flex", alignItems: "center", cursor: 'pointer' }}>
              {/* Conditionally render user's photo */}
              <img
                src={user?.photo_path ? `/storage/${user.photo_path}` : '/path/to/default-avatar.jpg'} // Default avatar if no photo
                alt="Profile"
                style={{
                  width: '40px', // Set width and height
                  height: '40px',
                  borderRadius: '50%', // Make it circular
                  marginRight: '8px',
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
