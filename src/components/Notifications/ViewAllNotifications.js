
import React,{useContext} from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';

const ViewAllNotifications = ({ notifications, onClose, isNotificationPage  }) => {
  const navigate=useNavigate()
  const { userData, localhosturl } =  useContext(UserContext);
 // console.log("notifications ",notifications)

  const getMessageText = (notification) => {
    const userStatus = notification.userStatus.find(status => status.userId === userData._id);
    
    if (userStatus) {
      if (userData?.role === 'Brand User' || userData?.role === 'User' || userData._id === notification.userId) {
        return notification.details.text1;
      } else if (userData?.role === 'Admin' || userData?.role === 'Super Admin') {
        return notification.details.text2;
      }
    }
    return //notification.details.message;
  };

  return (
    <div>
      <List>
        {notifications.map(notification => (
          <ListItem button key={notification.id}>
            <ListItemText  primary={getMessageText(notification)} //primary={notification.details.message}
             secondary={`${new Date(notification.createdAt).toLocaleString()} - ${notification.isSeen ? 'Seen' : 'Unseen'}`}  //secondary={notification.time}
             />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem button onClick={isNotificationPage ? onClose : () => navigate('/notifications')}>
        {isNotificationPage ? 'Close' : 'View All Notifications'}
      </ListItem>
     { /*<ListItem button onClick={onClose}>
        Close
      </ListItem>*/}
    </div>
  );
};

export default ViewAllNotifications;
