import React from 'react';
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

export default NotificationDropdown;
