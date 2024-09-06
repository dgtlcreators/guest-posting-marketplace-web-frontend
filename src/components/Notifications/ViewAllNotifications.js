// ViewAllNotifications.js
import React from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';

const ViewAllNotifications = ({ notifications, onClose }) => {
  return (
    <div>
      <List>
        {notifications.map(notification => (
          <ListItem button key={notification.id}>
            <ListItemText primary={notification.text} secondary={notification.time} />
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
