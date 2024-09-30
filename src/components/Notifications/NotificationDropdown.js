
// NotificationDropdown.js
import React, { useState } from 'react';
import { List, ListItem, ListItemText, Divider, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const NotificationDropdown = ({notifications,onViewAllClick,onClose}) => {
  const navigate = useNavigate();

  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const unseenNotifications = sortedNotifications.filter(n => !n.isSeen);
  const seenNotifications = sortedNotifications.filter(n => n.isSeen);
  const handleViewAllClick = () => {
   
    navigate('/notifications'); 
   
    onViewAllClick();
    onClose()
  };


  return (
    <div>
      <List>
        {unseenNotifications.map(notification => (
          <ListItem button key={notification.id}>
            <ListItemText primary={notification.details.message} secondary={`${new Date(notification.createdAt).toLocaleString()}`} />
          </ListItem>
        ))}
        {/*seenNotifications.map(notification => (
          <ListItem button key={notification.id}>
            <ListItemText primary={notification.text} secondary={notification.time} />
          </ListItem>
        ))*/}
        <Divider />
        <ListItem button>
         {/* <Link to="/notifications">*/}
           <Button fullWidth onClick={handleViewAllClick} //onClick={onViewAllClick}
           >View All Notifications</Button>
          {/* </Link>  */ }      
        </ListItem>
      </List>
    </div>
  );
};

export default NotificationDropdown;


/*import React from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';

const NotificationDropdown = () => {
  return (
    <div>
      <List>
        <ListItem button>
          <ListItemText primary="New Comment on your post" secondary="5 mins ago" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="New Follower" secondary="10 mins ago" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="New Like on your post" secondary="15 mins ago" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="View All Notifications" />
        </ListItem>
      </List>
    </div>
  );
};

export default NotificationDropdown;*/
