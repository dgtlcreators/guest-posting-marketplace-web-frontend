import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/userContext.js';
import axios from 'axios';
import { List, ListItem, Button, Typography } from '@mui/material';

const NotificationsPage = () => {
  const { localhosturl } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${localhosturl}/notificationroute/getAllNotifications`);
        setNotifications(response.data.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
  
    fetchNotifications();
  }, [localhosturl]);

  const handleMarkAsSeen = async (id) => {
    try {
      await axios.put(`${localhosturl}/notificationroute/updateNotifications/${id}`, {
        isSeen: true 
      });
      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, isSeen: true } : notification
      ));
    } catch (error) {
      console.error('Failed to mark notification as seen:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${localhosturl}/notificationroute/deleteNotifications/${id}`);
      setNotifications(notifications.filter(notification => notification._id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      <List>
        {notifications.map(notification => (
          <ListItem
            key={notification._id}
            style={{
              backgroundColor: notification.isSeen ? '#f0f0f0' : '#d1e7dd', 
              margin: '10px 0',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease',
              padding: '10px',
              display: 'flex', // Use flex for better alignment
              justifyContent: 'space-between', // Space between message and buttons
              alignItems: 'center', // Center items vertically
            }}
          >
            <div style={{ flexGrow: 1 }} onClick={() => !notification.isSeen && handleMarkAsSeen(notification._id)}>
              <Typography variant="body1">{notification.details.message}</Typography>
            </div>
            <div>
              {!notification.isSeen && (
                <Button 
                  onClick={() => handleMarkAsSeen(notification._id)} 
                  variant="contained" 
                  color="primary" 
                  style={{ marginRight: '10px' }}
                >
                  Mark as Read
                </Button>
              )}
              <Button onClick={() => handleDelete(notification._id)} variant="outlined" color="secondary">
                Delete
              </Button>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default NotificationsPage;




/*import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/userContext.js';
import axios from 'axios';
import { List, ListItem, Button, Typography } from '@mui/material';

const NotificationsPage = () => {
  const { localhosturl } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${localhosturl}/notificationroute/getAllNotifications`);
        setNotifications(response.data.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
  
    fetchNotifications();
  }, [localhosturl]);

  const handleMarkAsSeen = async (id) => {
    try {
      await axios.put(`${localhosturl}/notificationroute/updateNotifications/${id}`, {
        isSeen: true 
      });
      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, isSeen: true } : notification
      ));
    } catch (error) {
      console.error('Failed to mark notification as seen:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${localhosturl}/notificationroute/deleteNotifications/${id}`);
      setNotifications(notifications.filter(notification => notification._id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      <List>
        {notifications.map(notification => (
          <ListItem
            key={notification._id}
            style={{
              backgroundColor: notification.isSeen ? '#f0f0f0' : '#d1e7dd', 
              margin: '10px 0',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease',
              padding: '10px',
            }}
            onClick={() => !notification.isSeen && handleMarkAsSeen(notification._id)} 
          >
            <div>
              <Typography variant="body1">{notification.details.message}</Typography>
              <Button onClick={() => handleDelete(notification._id)}>Delete</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default NotificationsPage;
*/