

import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar,  Typography, Badge, Avatar, Button, Popover, InputBase, List, ListItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useTheme } from '../context/ThemeProvider.js';
import NotificationDropdown from './Notifications/NotificationDropdown.js';
import ViewAllNotifications from './Notifications/ViewAllNotifications.js';
import ProfileDropdown from './ProfileDropdown.js';
import IconButton from '@mui/material/IconButton';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import axios from 'axios'; 
import { UserContext } from '../context/userContext.js';

const Navbar = () => {
  const { userData, localhosturl,setNotifications,notifications, fetchNotifications  } = useContext(UserContext);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const { isDarkTheme, toggleTheme } = useTheme();

  const navigate=useNavigate()

 // const [notifications, setNotifications] = useState([]);
  /**[
    { id: 1, text: "New Comment on your post", time: "5 mins ago", seen: false },
    { id: 2, text: "New Follower", time: "10 mins ago", seen: false },
    { id: 3, text: "New Like on your post", time: "15 mins ago", seen: true },
  ] */

    /*useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(`${localhosturl}/notificationroute/getAllNotifications`); 
   
          setNotifications(response.data.data); 
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      };
  
    //  fetchNotifications();
    }, []);
    */
useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${localhosturl}/notificationroute/getAllNotifications`);
      const userNotifications = response.data.data.filter(notification => 
        notification.userStatus.some(status => status.userId === userData?._id)
      );
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  fetchNotifications();
}, [localhosturl, userData?._id]);


  const itemsToSearch = [
    { id: 1, title: "Guestpost",route:"guestpost" },
    { id: 2, title: "Instagram Influencer",route:"instagram-influencer" },
    { id: 3, title: "Youtube Influencer",route:"youtube-influencer" },
    { id: 4, title: "Content Writers",route:"content-writers" },
    { id: 5, title: "Past Activities",route:"past-activities" },
    { id: 6, title: "My Lists",route:"my-lists" },
    { id: 7, title: "Dashboard",route:"dashboard" },
  ];
  
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchTerm(''); 
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchTerm) {
  
      navigate(`/${searchTerm}`)
      const selectedItem = itemsToSearch.find(item => 
        item.title.toLowerCase() === searchTerm.toLowerCase()
      );
      if (selectedItem) {
        //navigate(`/${selectedItem.route}`);
        
      //  setSearchTerm('');
        //setIsSearchVisible(false); 
      }
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorElNotification(null);
  };

  const handleProfileClick = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorElProfile(null);
  };

  const openNotification = Boolean(anchorElNotification);
  const openProfile = Boolean(anchorElProfile);

  const handleViewAllClick = () => {
    //setShowAllNotifications(true);
  };

  const filteredItems = itemsToSearch.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    //fetchNotifications(localhosturl);
  }, [fetchNotifications, localhosturl]);

 

  const unseenCount1 = notifications.filter(notification =>
    notification?.userStatus.some(status =>
        status?.userId.toString() === userData?._id.toString() && !status?.isSeen
    )
).length;


const unseenCount = notifications.reduce((count, notification) => {
  const unseenUserStatus = notification?.userStatus.filter(status => 
      status?.userId.toString() === userData?._id.toString() && !status?.isSeen
  );
  
  return count + unseenUserStatus.length;
}, 0);
notifications.forEach(notification => {
  const userEntries = notification?.userStatus.filter(status => status?.userId=== userData?._id);
 // console.log("User Entries for Notification: ", userEntries);
});


  

  
  

  return (
    <AppBar position="static"  className={`nav ${isDarkTheme ? 'dark' : 'light'}`}>
      <Toolbar >
        
        <Typography  variant="h6" noWrap style={{
    backgroundColor: isDarkTheme ? 'transparent' : 'transparent', 
    color: isDarkTheme ? '#ffffff' : '#000000',
  }} >
          <div className="flex items-center space-x-2 nav" >
            <img src="https://res.cloudinary.com/domay7jbi/image/upload/v1724391266/tzu7lr5lgedv32ol48lu.png"
            //src="./creatorexchangepng.png" //src="https://api.asm.skype.com/v1/objects/0-jhb-d4-c3e3520ecdd3d82daeda53ea29f90fcf/views/imgpsh_fullsize_anim" 
            alt="CreatorsXchange Logo" className="h-10" />
            <span className="text-xl font-bold "  >CreatorsXchange</span>
          </div>
        </Typography>
        <div style={{ flexGrow: 1 }} />

        {isSearchVisible ? (
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
        <InputBase
          placeholder="Search..."
          style={{
            color: isDarkTheme ? '#fff' : '#000', 
            backgroundColor: isDarkTheme ? '#333' : '#bfbfbf', 
            borderRadius: 4,
            padding: '5px 10px',
            '&::placeholder': {
              color: isDarkTheme ? '#bbb' : '#888',
            },
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown} 
        />
        <IconButton onClick={toggleSearch} style={{ marginLeft: '4px', backgroundColor: isDarkTheme ? '#333' : '#bfbfbf' }}>
          <CloseIcon style={{ color: isDarkTheme ? '#fff' : '#000' }} />
        </IconButton>
        {searchTerm && (
          <List style={{ position: 'absolute', zIndex: 1, backgroundColor: isDarkTheme ? '#444' : '#fff', color: isDarkTheme ? '#fff' : '#000' }}>
            {filteredItems.map(item => (
              <ListItem button key={item.id} onClick={() => navigate(`/${item.route}`)}>
                {item.title}
              </ListItem>
            ))}
          </List>
        )}
      </div>
      
        ) : (
          <IconButton color="inherit" onClick={toggleSearch}>
            <SearchIcon />
          </IconButton>
        )}


       { /*{isSearchVisible && (
          <div style={{ position: 'relative', marginLeft: 'auto' }}>
            <InputBase
              placeholder="Search..."
              startAdornment={<SearchIcon />}
              style={{ color: 'inherit' }}
           //  style={{ color: 'inherit', backgroundColor: isDarkTheme ? '#333' : '#fff', borderRadius: 4, padding: '5px 10px' }}
             value={searchTerm}
             
              onChange={(e) => setSearchTerm(e.target.value)}
            />
              {searchTerm && (
              <List style={{ position: 'absolute', zIndex: 1, backgroundColor: isDarkTheme ? '#444' : '#fff' }}>
                {filteredItems.map(item => (
                  <ListItem button key={item.id} onClick={() => navigate(`/${item.route}`)}>
                    {item.title}
                  </ListItem>
                ))}
              </List>
            )}
          </div>
        )}
        <IconButton color="inherit" onClick={toggleSearch}>
          <SearchIcon />
        </IconButton>*/}


        {/* Notification Dropdown */}
         <IconButton color="inherit" onClick={handleNotificationClick}>
          <Badge badgeContent={unseenCount} 
          //badgeContent={notifications.filter(item=>item.isSeen===false).length} 
          color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Popover
          open={openNotification}
          anchorEl={anchorElNotification}
          onClose={handleNotificationClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {showAllNotifications ? (
            <ViewAllNotifications
              notifications={notifications}
              onClose={handleNotificationClose}
              isNotificationPage={true}
            />
          ) : (
            <NotificationDropdown onClose={handleNotificationClose} notifications={notifications} onViewAllClick={handleViewAllClick} />
          )}
        </Popover>
        {/*<IconButton color="inherit" onClick={handleNotificationClick}>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Popover
          open={openNotification}
          anchorEl={anchorElNotification}
          onClose={handleNotificationClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <NotificationDropdown />
        </Popover>*/}

        {/* Profile Dropdown */}
        <IconButton color="inherit" onClick={handleProfileClick}>
          <Avatar src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
        </IconButton>
        <Popover
          open={openProfile}
          anchorEl={anchorElProfile}
          onClose={handleProfileClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <ProfileDropdown />
        </Popover>
        <IconButton onClick={toggleTheme} color="inherit">
      {isDarkTheme ? <Brightness7 /> : <Brightness4 />}
    </IconButton>

        {/*<Button color="inherit" onClick={toggleTheme}>
          {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
        </Button>*/}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
