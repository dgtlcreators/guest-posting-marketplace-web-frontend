import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeProvider.js';
import { UserContext } from '../../context/userContext.js';


import { Box, Typography, Avatar, Paper, Switch, Grid, Divider, FormControlLabel } from '@mui/material';
import { FaInstagram, FaYoutube, FaPenFancy, FaBlog } from 'react-icons/fa'; // Icons for each section
import { motion } from 'framer-motion';

import { MdEmail, MdSecurity } from 'react-icons/md';
import { FiEdit3 } from 'react-icons/fi';

const SuperadminProfile = () => {
    const { isDarkTheme } = useTheme();
    const { id } = useParams();
  const { userData, localhosturl } = useContext(UserContext);
  const userId = userData?._id;
  const [user, setUser] = useState([]);
  const initialUser = {
    name: '',
    email: '',
    password: '',
    role: 'Brand User',
    permissions: {
      instagram: {
        add: false,
        edit: false,
        delete: false,
        bookmark: false,
        apply: false
      },
      youtube: {
        add: false,
        edit: false,
        delete: false,
        bookmark: false,
        apply: false
      },
      contentWriter: {
        add: false,
        edit: false,
        delete: false,
        bookmark: false,
        apply: false
      },
      guestPost: {
        add: false,
        edit: false,
        delete: false,
        bookmark: false,
        apply: false
      }
    }
  }
  const [formData, setFormData] = useState(initialUser);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        
        const response = await axios.get(`${localhosturl}/user/getUserId/${id}`);
        console.log(response.data.data)
        setUser(response.data.data);
        //pastactivitiesAdd(response.data.users);
      } catch (error) {
        console.error('Error fetching influencer data:', error);
      }
    };

    fetchUser();
  }, [id]);

  const handleSwitchToggle = (platform, action) => {
    setUser((prevUser) => ({
      ...prevUser,
      permissions: {
        ...prevUser.permissions,
        [platform]: {
          ...prevUser.permissions[platform],
          [action]: !prevUser.permissions[platform][action],
        },
      },
    }));
  };

  

  return (
    <div>
       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: 'auto', mt: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, mb: 2 }}>
            <MdSecurity size={40} />
          </Avatar>
          <Typography variant="h5" align="center">
           User Profile
          </Typography>
          <Typography variant="body1" align="center" mt={2}>
            {user.name} - {user.email}
          </Typography>
          <Typography variant="body1" align="center" mt={2}>
            Role - {user.role}
          </Typography>
        </Box>

        {/* Permission Sections */}
        <Typography variant="h6" gutterBottom>
          Permissions:
        </Typography>
        <Divider />

        <Grid container spacing={2} mt={3}>
          {/* Instagram */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <PermissionCard
                platform="Instagram"
                icon={<FaInstagram />}
                permissions={user?.permissions?.instagram}
                onToggle={handleSwitchToggle}
              />
            </motion.div>
          </Grid>

          {/* YouTube */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <PermissionCard
                platform="YouTube"
                icon={<FaYoutube />}
                permissions={user?.permissions?.youtube}
                onToggle={handleSwitchToggle}
              />
            </motion.div>
          </Grid>

          {/* Content Writer */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <PermissionCard
                platform="Content Writer"
                icon={<FaPenFancy />}
                permissions={user?.permissions?.contentWriter}
                onToggle={handleSwitchToggle}
              />
            </motion.div>
          </Grid>

          {/* Guest Post */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <PermissionCard
                platform="Guest Post"
                icon={<FaBlog />}
                permissions={user?.permissions?.guestPost}
                onToggle={handleSwitchToggle}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
    </div>
  )
}


const PermissionCard = ({ platform, icon, permissions = {}, onToggle }) => {
  return (
    <Paper elevation={2} sx={{ padding: 3, textAlign: 'center' }}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>{icon}</Avatar>
        <Typography variant="h6">{platform}</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {permissions && Object.keys(permissions).length > 0 ? (
        Object.keys(permissions).map((action) => (
          <FormControlLabel
            key={action}
            control={
              <Switch
                checked={permissions[action]}
                onChange={() => onToggle(platform.toLowerCase(), action)}
                color="primary"
              />
            }
            label={action.charAt(0).toUpperCase() + action.slice(1)}
          />
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          No permissions available.
        </Typography>
      )}
    </Paper>
  );
};


export default SuperadminProfile
