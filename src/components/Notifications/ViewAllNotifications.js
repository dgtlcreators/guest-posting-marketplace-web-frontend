
import React from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';

const ViewAllNotifications = ({ notifications, onClose }) => {
  console.log("notifications ",notifications)
  return (
    <div>
      <List>
        {notifications.map(notification => (
          <ListItem button key={notification.id}>
            <ListItemText primary={notification.details.message} secondary={`${new Date(notification.createdAt).toLocaleString()} - ${notification.isSeen ? 'Seen' : 'Unseen'}`}  //secondary={notification.time}
             />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem button onClick={onClose}>
        Close
      </ListItem>
    </div>
  );
};

export default ViewAllNotifications;
