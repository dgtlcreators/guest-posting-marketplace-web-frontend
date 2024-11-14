import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext.js';
import axios from 'axios';
import { useTheme } from '../../context/ThemeProvider.js';
import { toast } from 'react-toastify';

const Bookmark = ({ section, publisher }) => {
    const { userData,localhosturl } = useContext(UserContext); 
    const { isDarkTheme } = useTheme();
    const userId = userData?._id;
    const publisherId = publisher?._id;

    const createDescriptionElements = (formData, users) => {
        // console.log("createDescriptionElements formData and users",formData,users)
         const elements = [
           //{ key: 'User ID', value: users.userId },
           { key: 'Publisher', value: users.publisher },
           { key: 'Name', value: users.name },
           { key: 'Email', value: users.email },
           { key: 'Phone', value: users.phone },
           { key: 'Section', value: users.section },
           { key: 'Status', value: users.status },
           //{ key: 'Created At', value: users.createdAt.toISOString() } // Formats date to ISO string
       ];
       
     
       const formattedElements = elements
             .filter(element => element.value)
             .map(element => `${element.key}: ${element.value}`)
             .join(', ');
       return `${formattedElements}`;
     };
     const generateShortDescription = (formData, users) => {
      // console.log("generateShortDescription formData and users",formData,users)
       const elements = createDescriptionElements(formData, users).split(', ');
       
      
       const shortElements = elements.slice(0, 2);
     
       return `You created a new Bookmark with ${shortElements.join(' and ')} successfully.`;
     };


    const pastactivitiesAdd=async(users)=>{
        // console.log("users: ",users)
        const formData={}
         const description = createDescriptionElements(formData, users);
         const shortDescription = generateShortDescription(formData, users);
       
        try {
         const activityData={
           userId:userData?._id,
           action:"Created a new Bookmark entry",//New application submitted
           section:"Bookmark",
           role:userData?.role,
           timestamp:new Date(),
           details:{
             type:"bookmark",
             filter:{formData:users,total:users.length},
             description,
             shortDescription
             
     
           }
         }
        
         axios.post(`${localhosturl}/pastactivities/createPastActivities`, activityData)
        } catch (error) {
         console.log(error);
         
        }
       }
  return (
    <div>Bookmark</div>
  )
}

export default Bookmark