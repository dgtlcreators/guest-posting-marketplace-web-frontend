import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/userContext';
import { useTheme } from '@emotion/react';
import axios from 'axios';

const ShowApplyForm = ({ section, publisher }) => {
    const { userData, localhosturl } = useContext(UserContext);
    const { isDarkTheme } = useTheme();
    const userId = userData?._id;
    const publisherId = publisher?._id;

    const [isFormVisible, setIsFormVisible] = useState(false);

    const disableCheck = (section === "Guestpost" && userData.permissions.guestPost.apply) ||
    (section === "InstagramInfluencer" && userData.permissions.instagram.apply) ||
    (section === "YoutubeInfluencer" && userData.permissions.youtube.apply) ||
    (section === "ContenWriters" && userData.permissions.contentWriter.apply) 
   
    
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
 
   return `You delete a Apply with ${shortElements.join(' and ')} successfully.`;
 };
 
   const pastactivitiesAdd=async(users)=>{
    // console.log("users: ",users)
    const formData={}
     const description = createDescriptionElements(formData, users);
     const shortDescription = generateShortDescription(formData, users);
   
    try {
     const activityData={
       userId:userData?._id,
       action:"Delete a new application entry",//New application submitted
       section:"Apply",
       role:userData?.role,
       timestamp:new Date(),
       details:{
         type:"apply",
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
        <div className=""//"min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-700 via-gray-900 to-black"
        >
            {!isFormVisible ? (
                <button   disabled={disableCheck}
                title={disableCheck
                  ? "You are not allowed to access this feature"
                  :undefined// : ""
                }
                    onClick={() => setIsFormVisible(true)}
                    className="border bg-green-500 hover:bg-green-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                //"px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                    View Apply
                </button>
            ) : (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className='p-8 rounded shadow-lg'>
                    <span className="text-xl font-bold mb-4 text-center">View Application Form</span>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsFormVisible(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>

            )
            }
        </div>
    )
}
export default ShowApplyForm