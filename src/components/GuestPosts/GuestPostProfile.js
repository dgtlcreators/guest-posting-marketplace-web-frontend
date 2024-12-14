import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { useTheme } from '../../context/ThemeProvider.js';
import { UserContext } from '../../context/userContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import {
  faArrowLeft,
  faGlobe,
  faUser,
  faEnvelope,
  faPhone,
  faStar,
  faTag,
  faChartLine,
  faLanguage,
  faLink,
  faExclamationTriangle,

  faMoneyBill
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import ReportModal from '../OtherComponents/ReportForm.js';

const iconMap = {
  publisherURL: faGlobe,
  publisherName: faUser,
  publisherEmail: faEnvelope,
  publisherPhoneNo: faPhone,
  mozDA: faStar,
  categories: faTag,
  websiteLanguage: faLanguage,
  ahrefsDR: faChartLine,
  linkType: faLink,
  price: faMoneyBill,
  monthlyTraffic: faChartLine,
  mozSpamScore: faExclamationTriangle,
};

const GuestPostProfile = () => {



  const { userData, localhosturl } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const initialFormData = {
    publisherURL: "",
    publisherName: "",
    publisherEmail: "",
    publisherPhoneNo: "",
    mozDA: "",
    categories: "",
    websiteLanguage: "",
    ahrefsDR: "",
    linkType: "",
    price: "",
    monthlyTraffic: "",
    mozSpamScore: "",
    verifiedStatus:false

  };
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    fetchGuestpost();
  }, []);

  const fetchGuestpost = async () => {
    const response = await axios.get(`${localhosturl}/superAdmin/getOneAdminData/${id}`);

    try {
      setFormData(response.data);

    } catch (error) {
      console.error("Error fetching influencers", error);
    }
  }

  const createDescriptionElements = (formData, users) => {
    const elements = [
      { key: 'publisherURL', value: formData.publisherURL },
      { key: 'publisherName', value: formData.publisherName },
      { key: 'publisherEmail', value: formData.publisherEmail },
      { key: 'publisherPhoneNo', value: formData.publisherPhoneNo },
      { key: 'mozDA', value: formData.mozDA },
      {key: 'verified', value: formData.verifiedStatus},
      { key: 'categories', value: formData.categories },
      { key: 'websiteLanguage', value: formData.websiteLanguage },
      { key: 'ahrefsDR', value: formData.ahrefsDR },
      { key: 'linkType', value: formData.linkType },
      { key: 'price', value: formData.price },
      { key: 'monthlyTraffic', value: formData.monthlyTraffic },
      { key: 'mozSpamScore', value: formData.mozSpamScore },
    ];


    const formattedElements = elements.filter(element => element.value)
      .map(element => `${element.key}: ${element.value}`).join(', ');
    return `${formattedElements}`;
  };

  const generateShortDescription = (formData, users) => {
    const elements = createDescriptionElements(formData, users).split(', ');
    const shortElements = elements.slice(0, 2);
    return `You viewed a Guestpost ${shortElements.length > 0 ? "with" : ""} ${shortElements.join(' and ')} successfully.`;
  };

  useEffect(() => {
    if (formData.publisherURL) {
      pastactivitiesAdd(formData);
    }
  }, [formData]);


  const pastactivitiesAdd = async (users) => {
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);
    try {
      const activityData = {
        userId: userData?._id,
        action: "Viewed a Guestpost",
        section: "Guest Post",
        role: userData?.role,
        timestamp: new Date(),
        details: {
          type: "view",
          filter: { formData, total: users.length },
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
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition-all"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-lg shadow-lg bg-white"
      >
 <h2 className="text-2xl font-bold mb-6">Guest Post Profile</h2>

<div className="mb-6 mt-4 ml-4">
  <span
    className={`px-2 py-1 text-white rounded-md text-sm font-semibold`}
    style={{
      backgroundColor: formData.verifiedStatus ? 'green' : 'red',
      display: 'inline-block',
      width: 'fit-content',
    }}
  >
    {formData.verifiedStatus ? 'Verified' : 'Unverified'}
  </span>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(formData).map(
            ([key, value]) =>
              value && (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center p-4 border border-gray-300 rounded-lg"
                >
                  <FontAwesomeIcon
                    icon={iconMap[key] || faInfoCircle}
                    className="text-blue-500 mr-3"
                    title={key.replace(/([A-Z])/g, ' $1')}
                  />
                  <span className="font-semibold capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>{' '}
                  <span className="ml-2">{value}</span>
                </motion.div>
              )
          )}
        </div>

        <ReportModal
          section="Guestpost"
          userId={userData._id}
          publisherId={id}
          localhosturl={localhosturl}
        />
      </motion.div>
    </div>
  );
}

export default GuestPostProfile