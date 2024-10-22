// src/components/Sidebar.js
// src/components/Sidebar.js
import React, { useState, useContext, createContext,useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Avatar, Typography, Collapse, Popover } from '@mui/material';
import { ChevronLeft, ChevronRight, ExpandLess, ExpandMore } from '@mui/icons-material';
import { FaHome, FaPen, FaInstagram, FaYoutube, FaEdit, FaHistory, FaPlus, FaSignOutAlt, FaUserShield, FaRegFileAlt, FaUsersCog, FaUserPlus, FaUsers, FaList } from 'react-icons/fa';
import { useTheme } from '../context/ThemeProvider';
import { UserContext } from "../context/userContext.js";
import { colors } from './config/colors.js';

const SidebarContext = createContext();

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [newAddedOpen, setNewAddedOpen] = useState(false);
  const [superAdminOpen, setSuperAdminOpen] = useState(false);
  const { isDarkTheme, toggleTheme } = useTheme();
  const { userData, signOut } = useContext(UserContext); 
  const userId = userData?._id;
  const navigate = useNavigate();
  const isSuperAdmin = userData?.role === 'Super Admin';
  const isAdmin = userData?.role === 'Admin';

  const handleSignOut = () => {
    console.log("logout clicked")
    signOut();
    navigate("/login"); 
  };

  const handleNewAddedClick = () => {
    setNewAddedOpen(prev => !prev);
  };
  const handleSuperAdminClick = () => {
    setSuperAdminOpen(prev => !prev);
  };


  useEffect(() => {
    if (isAdmin) {
      document.title = "CreatorsXchange - Admin";
    } else if (isSuperAdmin) {
      document.title = "CreatorsXchange - SuperAdmin";
    } else {
      document.title = "CreatorsXchange - User"; 
    }
  }, [isAdmin, isSuperAdmin]);
  

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <Drawer
        variant="permanent"
        open={expanded}
        sx={{
          width: expanded ? 240 : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: expanded ? 240 : 60,
            boxSizing: 'border-box',
            backgroundColor: isDarkTheme ? '#333' : '#fff',
            position: 'relative',
            height: '100%', 
            transition: 'width 0.9s', 
          },
        }}
      >
        <div className="p-2">
          <IconButton onClick={() => setExpanded(curr => !curr)}>
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <SidebarItem icon={<FaHome />} text="Dashboard" to="/dashboard" />
          <SidebarItem icon={<FaList />} text="My Lists" to="/my-lists" />
          <SidebarItem icon={<FaPen />} text="Guest Post" to="/guestpost" //to="/form" 
          />
          <SidebarItem icon={<FaInstagram />} text="Instagram Influencer" to="/instagram-influencer" //to="/branduser" 
          />
          <SidebarItem icon={<FaYoutube />} text="YouTube Influencer" to="/youtube-influencer" />
          <SidebarItem icon={<FaEdit />} text="Content Writers" to="/content-writers" />
          <SidebarItem icon={<FaHistory />} text="Past Activities" to="/past-activities" />
        {/*  <SidebarItem icon={<FaUserShield />} text="Super Admin" to="/addSuperadmin" />*/}

          {isSuperAdmin && (
            <>
              <ListItem button onClick={handleSuperAdminClick} sx={{ pl: expanded ? 2 : 0 }}>
                <ListItemIcon><FaUsersCog /></ListItemIcon> 
                {expanded && <ListItemText primary="Admin Management" />} {/* Super Admin Section,Admin Management Section */}
                {superAdminOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={superAdminOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <SidebarItem icon={<FaUsers />} text="Manage Admins" to="/superadmin" nested />{/** User Management*/}
                  <SidebarItem icon={<FaUserPlus />} text="Assign Admin Roles" to="/addSuperadmin" nested /> {/*Add Admin,Manage User Roles */}
                </List>
              </Collapse>
            </>
          )}
          {(isSuperAdmin || isAdmin ) && (
            <>
          <ListItem button onClick={handleNewAddedClick} sx={{ pl: expanded ? 2 : 0 }}>
            <ListItemIcon>{<FaPlus />}</ListItemIcon>
            {expanded && <ListItemText primary="Admin Section"//"New Added" 
            />}
            {newAddedOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={newAddedOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
          { /* <SidebarItem icon={<FaRegFileAlt />} text="Reports" to="/reports" nested/>*/}
          <SidebarItem icon={<FaRegFileAlt />} text="Reports and Applications" to="/reports-applications" nested />

               <SidebarItem icon={<FaPen />} text="Guest Post Add" to="/addGuestpost" //to="/admin" 
              nested />
              <SidebarItem icon={<FaInstagram />} text="Instagram Influencer Add" to="/addInstagramInfluencer" //to="/instagramInfluencer" 
              nested />
              <SidebarItem icon={<FaYoutube />} text="Youtube Influencer Add" to="/addYoutubeInfluencer" 
              nested />
              <SidebarItem icon={<FaEdit />} text="Content Writers Add" to="/addContentWriters" //to="/newContentWriters" 
              nested />
            </List>
          </Collapse>
          </>)}
          <ListItem button onClick={handleSignOut} sx={{ pl: expanded ? 2 : 0 }}>
          <ListItemIcon><FaSignOutAlt /></ListItemIcon>
          {expanded && <ListItemText primary="Sign Out" />}
        </ListItem>
          {/*<SidebarItem icon={<FaSignOutAlt />} to="#" text="Sign Out"  onClick={handleSignOut} />*/}
        
        </List>
        <Divider />
       {/* <div className="flex items-center p-2">
          <Avatar src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&name=${userData?.name || 'User'}`} />
          {expanded && userData && (
            <div className="ml-2">
              <Typography variant="h6"  style={{
    backgroundColor: isDarkTheme ? 'transparent' : 'transparent', 
    
  }}>{userData.name || 'User'}</Typography>
              <Typography variant="body2">{userData.email || 'user@example.com'}</Typography>
            </div>
          )}
        </div>*/}
      </Drawer>
    </SidebarContext.Provider>
  );
}

export function SidebarItem({ icon, text, to, nested }) {
  const { expanded } = useContext(SidebarContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const handlePopoverOpen = (event) => {
    if (!expanded) {
      setAnchorEl(event.currentTarget);
      setPopoverOpen(true);
    }
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
  };

  return (
    <>
    <ListItem
        button
        component={NavLink}
        to={to}
        sx={{ pl: nested ? (expanded ? 4 : 2) : (expanded ? 2 : 0) 
          , '&:hover': {
            backgroundColor: colors.secondaryBackground,
           // backgroundColor: 'rgba(0, 0, 0, 0.08)', 
           transform: 'scale(1.05)', 
           transition: 'background-color 0.3s, transform 0.3s',
          },
          '&.active': {
            backgroundColor: colors.activeBackground, 
          },
          transition: 'background-color 0.3s, transform 0.3s',
        }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        {expanded && <ListItemText primary={text} />}
      </ListItem>
      {/*<Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        disableRestoreFocus
        onMouseEnter={() => setPopoverOpen(true)}
        onMouseLeave={handlePopoverClose}
      >
        <Typography sx={{ p: 1 }}>{text}</Typography>
      </Popover>*/}
      </>
  );
}

/*import React, { useState, useContext, createContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Avatar, Typography, Collapse, Popover } from '@mui/material';
import { ChevronLeft, ChevronRight, ExpandLess, ExpandMore } from '@mui/icons-material';
import { FaHome, FaPen, FaInstagram, FaYoutube, FaEdit, FaHistory, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { useTheme } from '../context/ThemeProvider';
import { UserContext } from '../context/userContext.js';

const SidebarContext = createContext();

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [newAddedOpen, setNewAddedOpen] = useState(false);
  const { isDarkTheme } = useTheme();
  const { userData } = useContext(UserContext);

  const handleNewAddedClick = () => {
    setNewAddedOpen(prev => !prev);
  };

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <Drawer
        variant="permanent"
        open={expanded}
        sx={{
          width: expanded ? 240 : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: expanded ? 240 : 60,
            boxSizing: 'border-box',
            backgroundColor: isDarkTheme ? '#333' : '#fff',
            position: 'relative',
            height: '100%',
          },
        }}
      >
        <div className="p-2">
          <IconButton onClick={() => setExpanded(curr => !curr)}>
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <SidebarItem icon={<FaHome />} text="Dashboard" to="/dashboard" />
          <SidebarItem icon={<FaPen />} text="Guest Post" to="/form" />
          <SidebarItem icon={<FaInstagram />} text="Instagram Influencer" to="/branduser" />
          <SidebarItem icon={<FaYoutube />} text="YouTube Influencer" to="/youtube-influencer" />
          <SidebarItem icon={<FaEdit />} text="Content Writers" to="/content-writers" />
          <SidebarItem icon={<FaHistory />} text="Past Activities" to="/past-activities" />
          <ListItem button onClick={handleNewAddedClick} sx={{ pl: expanded ? 2 : 0 }}>
            <ListItemIcon>{<FaPlus />}</ListItemIcon>
            {expanded && <ListItemText primary="New Added" />}
            {newAddedOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={newAddedOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <SidebarItem icon={<FaInstagram />} text="Instagram Influencer Add" to="/instagram-influencer-add" nested />
              <SidebarItem icon={<FaPen />} text="Guest Post Add" to="/guest-post-add" nested />
            </List>
          </Collapse>
          <SidebarItem icon={<FaSignOutAlt />} text="Sign Out" to="/sign-out" />
        </List>
        <Divider />
        <div className="flex items-center p-2">
          <Avatar src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&name=${userData?.name || 'User'}`} />
          {expanded && userData && (
            <div className="ml-2">
              <Typography variant="h6">{userData.name || 'User'}</Typography>
              <Typography variant="body2">{userData.email || 'user@example.com'}</Typography>
            </div>
          )}
        </div>
      </Drawer>
    </SidebarContext.Provider>
  );
}

export function SidebarItem({ icon, text, to, nested }) {
  const { expanded } = useContext(SidebarContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handlePopoverOpen = (event) => {
    if (!expanded) {
      setAnchorEl(event.currentTarget);
      setPopoverOpen(true);
    }
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
  };

  return (
    <>
      <ListItem
        button
        component={NavLink}
        to={to}
        sx={{ pl: nested ? (expanded ? 4 : 2) : (expanded ? 2 : 0) }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        {expanded && <ListItemText primary={text} />}
      </ListItem>
      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        disableRestoreFocus
        onMouseEnter={() => setPopoverOpen(true)}
        onMouseLeave={handlePopoverClose}
      >
        <Typography sx={{ p: 1 }}>{text}</Typography>
      </Popover>
    </>
  );
}

*/






/*import React, { useState, useContext, createContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Avatar, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { FaHome, FaPen, FaInstagram, FaYoutube, FaEdit, FaHistory, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { useTheme } from '../context/ThemeProvider';
import { UserContext } from "../context/userContext.js";

const SidebarContext = createContext();

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const { isDarkTheme } = useTheme();
  const { userData } = useContext(UserContext); 
  //console.log(userData)
  const userId = userData?._id;


  return (
    <SidebarContext.Provider value={{ expanded }}>
      <Drawer
        variant="permanent"
        open={expanded}
        sx={{
          width: expanded ? 240 : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: expanded ? 240 : 60,
            boxSizing: 'border-box',
            backgroundColor: isDarkTheme ? '#333' : '#fff',
            position: 'relative',
            height: '100%', 
          },
        }}
      >
        <div className="p-2">
          <IconButton onClick={() => setExpanded(curr => !curr)}>
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <SidebarItem icon={<FaHome />} text="Dashboard" to="/dashboard" />
          <SidebarItem icon={<FaPen />} text="Guest Post" to="/form" />
          <SidebarItem icon={<FaInstagram />} text="Instagram Influencer" to="/branduser" />
          <SidebarItem icon={<FaYoutube />} text="YouTube Influencer" to="/youtube-influencer" />
          <SidebarItem icon={<FaEdit />} text="Content Writers" to="/content-writers" />
          <SidebarItem icon={<FaHistory />} text="Past Activities" to="/past-activities" />
          <SidebarItem icon={<FaPlus />} text="New Added" to="/new-added" />
          <SidebarItem icon={<FaSignOutAlt />} text="Sign Out" to="/sign-out" />
        </List>
        <Divider />
        <div className="flex items-center p-2">
          <Avatar src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&name=${userData?.name || 'User'}`} />
          {expanded && userData && (
            <div className="ml-2">
              <Typography variant="h6">{userData.name || 'User'}</Typography>
              <Typography variant="body2">{userData.email || 'user@example.com'}</Typography>
            </div>
          )}
        </div>
      </Drawer>
    </SidebarContext.Provider>
  );
}

export function SidebarItem({ icon, text, to }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <ListItem button component={NavLink} to={to}>
      <ListItemIcon>{icon}</ListItemIcon>
      {expanded && <ListItemText primary={text} />}
    </ListItem>
  );
}
*/












/*import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { useContext, createContext, useState } from "react";
import { FaHome, FaPen, FaInstagram, FaYoutube, FaEdit, FaHistory, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const SidebarContext = createContext();

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen">
      <nav className={`h-full flex flex-col ${expanded ? 'bg-gray-800' : 'bg-gray-900'} border-r shadow-md`}>
        <div className="p-4 pb-2 flex justify-between items-center">
          <span className={`overflow-hidden transition-all ml-2 text-xl font-bold text-white ${expanded ? "w-32" : "w-0"}`}>Marketplace</span>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            <SidebarItem icon={<FaHome />} text="Dashboard" to="/dashboard" />
            <SidebarItem icon={<FaPen />} text="Guest Post" to="/guest-post" />
            <SidebarItem icon={<FaInstagram />} text="Instagram Influencer" to="/instagram-influencer" />
            <SidebarItem icon={<FaYoutube />} text="YouTube Influencer" to="/youtube-influencer" />
            <SidebarItem icon={<FaEdit />} text="Content Writers" to="/content-writers" />
            <SidebarItem icon={<FaHistory />} text="Past Activities" to="/past-activities" />
            <SidebarItem icon={<FaPlus />} text="New Added" to="/new-added" />
            <SidebarItem icon={<FaSignOutAlt />} text="Sign Out" to="/sign-out" />
          </ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-white">John Doe</h4>
              <span className="text-xs text-gray-400">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} className="text-white" />
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, to }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) => `
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group text-decoration-none
          ${
            isActive
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
              : "hover:bg-indigo-50 text-gray-600"
          }
        `}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {!expanded && (
          <div
            className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
          >
            {text}
          </div>
        )}
      </NavLink>
    </li>
  );
}*/



/*import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const sidebarStyle = {
    backgroundColor: '#2d3748',
    color: 'white',
    width: isCollapsed ? '4rem' : '16rem',
    minHeight: '100vh',
    transition: 'width 0.3s',
    position: 'fixed', // Keeps the sidebar fixed on the screen
    top: 0,
    left: 0,
    overflowX: 'hidden', // Prevents horizontal scrolling
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    whiteSpace: 'nowrap', // Prevents text from wrapping
    overflow: 'hidden',
    textOverflow: 'ellipsis', // Adds ellipsis when text overflows
  };

  const activeStyle = {
    backgroundColor: '#4a5568',
  };

  const dropdownMenuStyle = {
    paddingLeft: '1rem',
    marginTop: '0.5rem',
    display: isCollapsed || !isDropdownOpen ? 'none' : 'block',
  };

  const iconStyle = {
    minWidth: '2rem', // Ensures icons fit properly
    textAlign: 'center',
  };

  return (
    <aside style={sidebarStyle}>
      <div className="flex items-center justify-between p-4">
        <h1 style={{ display: isCollapsed ? 'none' : 'block', fontSize: '1.125rem', fontWeight: 'bold' }}>
          Menu
        </h1>
        <button onClick={toggleSidebar} style={{ padding: '0.5rem', outline: 'none' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18"></path>
          </svg>
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          <li>
            <NavLink to="/dashboard" style={itemStyle} activeStyle={activeStyle}>
              <div style={iconStyle}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18"></path>
                </svg>
              </div>
              <span style={{ display: isCollapsed ? 'none' : 'inline', marginLeft: '0.5rem' }}>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/guest-post" style={itemStyle} activeStyle={activeStyle}>
              <div style={iconStyle}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h6m-6 4h6m-6 4h6m-6 4h6"></path>
                </svg>
              </div>
              <span style={{ display: isCollapsed ? 'none' : 'inline', marginLeft: '0.5rem' }}>Guest Post</span>
            </NavLink>
          </li>
          <li>
            <button style={itemStyle} onClick={toggleDropdown}>
              <div style={iconStyle}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14h-3a2.032 2.032 0 00-1.595.595L12 15m0-4h3l-1.405-1.405A2.032 2.032 0 0113 9H9a2.032 2.032 0 00-1.595.595L6 10m9 0a2.032 2.032 0 011.595-.595L18 11"></path>
                </svg>
              </div>
              <span style={{ display: isCollapsed ? 'none' : 'inline', marginLeft: '0.5rem' }}>Influencer</span>
              <svg className={`w-4 h-4 ml-auto ${isCollapsed ? 'hidden' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <ul style={dropdownMenuStyle}>
              <li>
                <NavLink to="/instagramInfluencer" style={itemStyle} activeStyle={activeStyle}>
                  <div style={iconStyle}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12a9 9 0 100-18 9 9 0 000 18zm0 4.5c3.9 0 7.5-3.6 7.5-8.5h-3c0 2.8-2.2 5-5 5s-5-2.2-5-5H4.5c0 4.9 3.6 8.5 7.5 8.5zM15.7 3.3c.4-.4.4-1 0-1.4l-1-1c-.4-.4-1-.4-1.4 0l-1 1c-.4.4-.4 1 0 1.4l1 1c.4.4 1 .4 1.4 0zM7.3 3.3c-.4-.4-.4-1 0-1.4l1-1c.4-.4 1-.4 1.4 0l1 1c.4.4.4 1 0 1.4l-1 1c-.4.4-1 .4-1.4 0z"></path>
                    </svg>
                  </div>
                  <span style={{ display: isCollapsed ? 'none' : 'inline', marginLeft: '0.5rem' }}>Instagram Influencer</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/youtubeInfluencer" style={itemStyle} activeStyle={activeStyle}>
                  <div style={iconStyle}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12l-6 4.5V7.5L15 12zm-4.5 1.5L12 12.5v-1l-1.5 1z"></path>
                    </svg>
                  </div>
                  <span style={{ display: isCollapsed ? 'none' : 'inline', marginLeft: '0.5rem' }}>YouTube Influencer</span>
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;*/
