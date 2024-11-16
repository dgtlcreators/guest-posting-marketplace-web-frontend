
import React, { useState, useContext, createContext,useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Avatar, Typography, Collapse, Popover } from '@mui/material';
import { ChevronLeft, ChevronRight, ExpandLess, ExpandMore } from '@mui/icons-material';
import { FaHome, FaPen, FaInstagram, FaYoutube, FaEdit, FaHistory, FaPlus, FaSignOutAlt, FaUserShield, FaRegFileAlt, FaUsersCog, FaUserPlus, FaUsers, FaList } from 'react-icons/fa';
import { useTheme } from '../context/ThemeProvider.js';
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
  const isUser = userData?.role === 'User' || userData?.role === 'Brand User';


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
    } else if(isUser) {
      document.title = "CreatorsXchange - User"; 
    }
    document.title = "CreatorsXchange"; 
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
          <SidebarItem icon={<FaHome />} text="Dashboard" to="/dashboard" isDarkTheme={isDarkTheme} />
          <SidebarItem icon={<FaList />} text="My Lists" to="/my-lists" isDarkTheme={isDarkTheme} />
          <SidebarItem icon={<FaPen />} text="Guest Post" to="/guestpost" isDarkTheme={isDarkTheme} //to="/form" 
          />
          <SidebarItem icon={<FaInstagram />} text="Instagram Influencer" to="/instagram-influencer" isDarkTheme={isDarkTheme} //to="/branduser" 
          />
          <SidebarItem icon={<FaYoutube />} text="YouTube Influencer" to="/youtube-influencer" isDarkTheme={isDarkTheme} />
          <SidebarItem icon={<FaEdit />} text="Content Writers" to="/content-writers" isDarkTheme={isDarkTheme}/>
          <SidebarItem icon={<FaHistory />} text="Past Activities" to="/past-activities" isDarkTheme={isDarkTheme} />
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
                  <SidebarItem icon={<FaUsers />} text="Manage Admins" to="/superadmin" nested isDarkTheme={isDarkTheme}/>{/** User Management*/}
                  <SidebarItem icon={<FaUserPlus />} text="Assign Admin Roles" to="/addSuperadmin" nested isDarkTheme={isDarkTheme}/> {/*Add Admin,Manage User Roles */}
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
          <SidebarItem icon={<FaRegFileAlt />} text="Reports and Applications" to="/reports-applications" nested isDarkTheme={isDarkTheme}/>

               <SidebarItem icon={<FaPen />} text="Guest Post Add" to="/addGuestpost" isDarkTheme={isDarkTheme}//to="/admin" 
              nested />
              <SidebarItem icon={<FaInstagram />} text="Instagram Influencer Add" to="/addInstagramInfluencer" isDarkTheme={isDarkTheme}//to="/instagramInfluencer" 
              nested />
              <SidebarItem icon={<FaYoutube />} text="Youtube Influencer Add" to="/addYoutubeInfluencer" isDarkTheme={isDarkTheme}
              nested />
              <SidebarItem icon={<FaEdit />} text="Content Writers Add" to="/addContentWriters" isDarkTheme={isDarkTheme}//to="/newContentWriters" 
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

export function SidebarItem({ icon, text, to, nested, isDarkTheme }) {
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
            backgroundColor: isDarkTheme ? colors.secondaryBackground : 'rgba(0, 0, 0, 0.08)', 
           // backgroundColor: colors.secondaryBackground,
           // backgroundColor: 'rgba(0, 0, 0, 0.08)', 
           transform: 'scale(1.05)', 
           transition: 'background-color 0.3s, transform 0.3s',
          },
          '&.active': {
            backgroundColor: isDarkTheme ? colors.activeBackground : 'rgba(0, 0, 0, 0.2)', 
           // backgroundColor: colors.activeBackground, 
          },
          transition: 'background-color 0.3s, transform 0.3s',
          backgroundColor: isDarkTheme ? '#444' : '#fff', // Apply background color based on theme
          color: isDarkTheme ? '#fff' : '#000', 
        }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <ListItemIcon sx={{ color: isDarkTheme ? '#fff' : '#000' }}>{icon}</ListItemIcon>
        {expanded && <ListItemText primary={text} sx={{ color: isDarkTheme ? '#fff' : '#000' }} />}
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
