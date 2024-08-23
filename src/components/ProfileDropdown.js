import React, { useContext } from 'react';
import { List, ListItem, ListItemText, Divider, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const ProfileDropdown = () => {
    
    const { signOut,userData } = useContext(UserContext);
    const navigate = useNavigate();

  const handleSignOut = () => {
    //setUserData(null);
    signOut();
    navigate("/login");
  };
  return (
    
    <div>
      <List>
        {/*<ListItem button onClick={() => navigate('/profile')}>
          <ListItemText primary="My Profile" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => navigate('/settings')}>
          <ListItemText primary="Settings" />
        </ListItem>
        <Divider />*/}
        <ListItem>
          <Box>
            <Typography variant="h6">{userData?.name || 'User'}</Typography>
            <Typography variant="body2">{userData?.email || 'user@example.com'}</Typography>
          </Box>
        </ListItem>
        <Divider />
        <ListItem>
          <Button variant="contained" color="secondary"   onClick={handleSignOut}>
            Sign Out
          </Button>
        </ListItem>
      </List>
    </div>
  );
};

export default ProfileDropdown;
