

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar,  Typography, Badge, Avatar, Button, Popover, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useTheme } from '../context/ThemeProvider';
import NotificationDropdown from './NotificationDropdown.js';
import ProfileDropdown from './ProfileDropdown.js';
import IconButton from '@mui/material/IconButton';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const Navbar = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const { isDarkTheme, toggleTheme } = useTheme();

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
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
        {isSearchVisible && (
          <div style={{ position: 'relative', marginLeft: 'auto' }}>
            <InputBase
              placeholder="Search..."
              startAdornment={<SearchIcon />}
              style={{ color: 'inherit' }}
            />
          </div>
        )}
        <IconButton color="inherit" onClick={toggleSearch}>
          <SearchIcon />
        </IconButton>

        {/* Notification Dropdown */}
        <IconButton color="inherit" onClick={handleNotificationClick}>
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
        </Popover>

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





/*import React, { useState } from 'react';
import { useTheme } from '../context/ThemeProvider';
import { AppBar, Toolbar, IconButton, Typography, InputBase, Badge, Avatar, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';//
//import creatorexchangepng from "../../public/creatorexchangepng"

const Navbar = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { isDarkTheme, toggleTheme } = useTheme();

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap>
        <div className="flex items-center space-x-2">
          <img src={"/creatorexchangepng.png"}//"https://api.asm.skype.com/v1/objects/0-jhb-d4-c3e3520ecdd3d82daeda53ea29f90fcf/views/imgpsh_fullsize_anim" alt="CreatorsXchange Logo" 
          className="h-10" />
          <span className="text-xl font-bold">CreatorsXchange</span>
        </div>
        </Typography>
        <div style={{ flexGrow: 1 }} />
        {isSearchVisible && (
          <div style={{ position: 'relative', marginLeft: 'auto' }}>
            <InputBase
              placeholder="Search..."
              startAdornment={<SearchIcon />}
              style={{ color: 'inherit' }}
            />
          </div>
        )}
        <IconButton color="inherit" onClick={toggleSearch}>
          <SearchIcon />
        </IconButton>
        <IconButton color="inherit">
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit">
          <Avatar src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
        </IconButton>
        <Button color="inherit" onClick={toggleTheme}>
          {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
*/



/*import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-semibold">Guest Posting Marketplace</div>
        <div className="flex items-center space-x-4">
          <Link to="/notifications" className="text-white">Notifications</Link>
          <Link to="/profile" className="text-white">Profile</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar*/















/*import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const userDropdownItems = [
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
    { label: 'Logout', href: '/logout' },
  ];

  return (
    <div>
      {/* Top Navbar for All Screens }
      <nav className="bg-gray-800 text-white w-full h-16 flex items-center justify-between px-4 fixed top-0 left-0 z-50">
        <div className="flex items-center space-x-2">
          <img src="https://api.asm.skype.com/v1/objects/0-jhb-d4-c3e3520ecdd3d82daeda53ea29f90fcf/views/imgpsh_fullsize_anim" alt="CreatorsXchange Logo" className="h-12" />
          <span className="text-xl font-bold">CreatorsXchange</span>
        </div>
        <button
          className="text-xl focus:outline-none md:hidden"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          )}
        </button>
      </nav>

      {/* Sidebar for Medium Screens }
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:hidden z-50`}
        style={{ top: '4rem' }} 
      >
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-2">
            <img src="https://api.asm.skype.com/v1/objects/0-jhb-d4-c3e3520ecdd3d82daeda53ea29f90fcf/views/imgpsh_fullsize_anim" alt="CreatorsXchange Logo" className="h-12" />
            <span className="text-xl font-bold">CreatorsXchange</span>
          </div>
          <button
            className="text-xl focus:outline-none md:hidden"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex flex-col space-y-2 px-4">
          <Link to="/form" className="block px-4 py-2 rounded-md hover:bg-gray-700" onClick={toggleSidebar}>Form</Link>
          <Link to="/login" className="block px-4 py-2 rounded-md hover:bg-gray-700" onClick={toggleSidebar}>Login</Link>
          <Link to="/signup" className="block px-4 py-2 rounded-md hover:bg-gray-700" onClick={toggleSidebar}>Signup</Link>
          <Link to="/admin" className="block px-4 py-2 rounded-md hover:bg-gray-700" onClick={toggleSidebar}>Admin</Link>
          <Link to="/superadmin" className="block px-4 py-2 rounded-md hover:bg-gray-700" onClick={toggleSidebar}>SuperAdmin</Link>
          <Link to="/instagramInfluencer" className="block px-4 py-2 rounded-md hover:bg-gray-700" onClick={toggleSidebar}>Instagram Influencer</Link>
          <Link to="/branduser" className="block px-4 py-2 rounded-md hover:bg-gray-700" onClick={toggleSidebar}>Brand User</Link>
          <Link to="/application" className="block px-4 py-2 rounded-md hover:bg-gray-700" onClick={toggleSidebar}>Application</Link>
        </div>
      </div>

      {/* Navbar for Large Screens }
      <nav className="hidden md:flex bg-gray-800 text-white w-full h-16 items-center justify-between px-4 fixed top-0 left-0 z-50">
        <div className="flex items-center space-x-4">
          <img src="https://api.asm.skype.com/v1/objects/0-jhb-d4-c3e3520ecdd3d82daeda53ea29f90fcf/views/imgpsh_fullsize_anim" alt="CreatorsXchange Logo" className="h-12" />
          <span className="text-xl font-bold">CreatorsXchange</span>
          <Link to="/form" className="px-4 py-2 rounded-md hover:bg-gray-700">Form</Link>
          <Link to="/login" className="px-4 py-2 rounded-md hover:bg-gray-700">Login</Link>
          <Link to="/signup" className="px-4 py-2 rounded-md hover:bg-gray-700">Signup</Link>
          <Dropdown title="Admin" items={[
            { label: 'Admin', href: '/admin' },
            { label: 'SuperAdmin', href: '/superadmin' },
          ]} />
          <Dropdown title="Instagram" items={[
            { label: 'Instagram Influencer', href: '/instagramInfluencer' },
            { label: 'Brand User', href: '/branduser' },
            { label: 'Application', href: '/application' },
          ]} />
        </div>
        <div className="flex items-center space-x-4">
          <Dropdown title={<img src="https://via.placeholder.com/40" alt="User Avatar" className="rounded-full w-10 h-10" />} items={userDropdownItems} />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

*/