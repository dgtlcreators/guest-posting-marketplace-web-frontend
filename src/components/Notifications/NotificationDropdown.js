
// NotificationDropdown.js
import React, { useContext, useState } from 'react';
import { List, ListItem, ListItemText, Divider, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider.js';
import { UserContext } from '../../context/userContext.js';

const NotificationDropdown = ({notifications,onViewAllClick,onClose}) => {
  const navigate = useNavigate();
  const { userData, localhosturl } = useContext(UserContext);
  const { isDarkTheme } = useTheme();

 // const sortedNotifications = [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

 // const unseenNotifications = sortedNotifications.filter(n => !n.isSeen);
 // const seenNotifications = sortedNotifications.filter(n => n.isSeen);

  const sortedNotifications = [...notifications]
  .filter(notification => notification.userStatus.some(status => status.userId === userData._id))
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const unseenNotifications = sortedNotifications.filter(n => !n.userStatus.find(status => status.userId === userData._id && status.isSeen));

  const handleViewAllClick = () => {
   
    navigate('/notifications'); 
   
    onViewAllClick();
    onClose()
  };

  const getMessageText1 = (notification) => {
    if (!userData || !notification) return '';


    const userIdString = userData._id.toString();

   
    const isUserInStatus = notification.userStatus.some(status => status.userId.toString() === userIdString);


   const userStatus = notification.userStatus.find(status => status.userId === userData._id);

   // console.log("userData._id===notification.userId ",userData._id,notification.userId,notification,userData._id===notification.userId)
    if (userData?.role === 'Brand User' || userData?.role === 'User' || isUserInStatus) {
      return notification.details.text1
     // return `User Brand notification: ${notification.details.message}`;
    } else if (userData?.role === 'Admin' || userData?.role === 'Super Admin') {
      return notification.details.text2
      //return `Admin notification: ${notification.details.message}`;
    }
    return notification.details.message; 
  };
  const getMessageText = (notification) => {
    const userStatus = notification.userStatus.find(status => status.userId === userData._id);
    
    if (userStatus) {
      if (userData?.role === 'Brand User' || userData?.role === 'User' || userData._id === notification.userId) {
        return notification.details.text1;
      } else if (userData?.role === 'Admin' || userData?.role === 'Super Admin') {
        return notification.details.text2;
      }
    }
    return notification.details.message;
  };

  return (
    <div>
      <List>
        {unseenNotifications.map(notification => (
          <ListItem button key={notification.id}>
            <ListItemText primary={getMessageText(notification)}//{/*notification.details.message*/}
             secondary={`${new Date(notification.createdAt).toLocaleString()}`} />
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
