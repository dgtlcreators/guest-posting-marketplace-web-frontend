import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ContentWriterTable from './ContentWriterTable.js';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/userContext.js';
import SaveSearch from "../OtherComponents/SaveSearch.js";
import { useLocation } from 'react-router-dom';
import LocationSelector from '../OtherComponents/LocationSelector.js';


const ContentWriter = () => {

  const { userData, localhosturl } = useContext(UserContext);
  // const userId = userData?._id;
  const initialFormData = {
    name: '',
    bio: '',
    experienceFrom: '',
    experienceTo: '',
    email: '',
    expertise: [{ type: '', other: '' }],
    languages: [{ name: '', other: '', proficiency: '' }],
    verifiedStatus:false,
    location: {
      country: "",
      state: "",
      city: ""
    },
    collaborationRates: {
      hourlyRateFrom: '',
      hourlyRateTo: '',
      perWordRateFrom: '',
      perWordRateTo: '',
      projectRateFrom: '',
      projectRateTo: ''
    },
    languageProficiency: '',
    industry: [{ type: '', other: '', subCategories: [{ type: '', other: '' }] }],

  }
  const [formData, setFormData] = useState(initialFormData);



  const [writers, setWriters] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('collaborationRates')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        collaborationRates: {
          ...prev.collaborationRates,
          [key]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else if (name.startsWith('languages')) {
      const [index, key] = name.split('.').slice(1);
      setFormData((prev) => {
        const updatedLanguages = [...prev.languages];
        if (key === 'name') {
          if (value === "Other" || !updatedLanguages.some((lang, idx) => idx !== index && lang.name === value)) {
            updatedLanguages[index][key] = value;
          }
        } else {
          updatedLanguages[index][key] = value;
        }
        return { ...prev, languages: updatedLanguages };
      });
    } else if (name.startsWith('expertise')) {
      const [index, key] = name.split('.').slice(1);
      setFormData((prev) => {
        const updatedExpertise = [...prev.expertise];
        if (key === 'type') {
          if (value === "Other" || !updatedExpertise.some((exp, idx) => idx !== index && exp.type === value)) {
            updatedExpertise[index][key] = value;
          }
        } else {
          updatedExpertise[index][key] = value;
        }
        return { ...prev, expertise: updatedExpertise };
      });
    }
    else if (name.startsWith('industry')) {
      const [outerIndex, key] = name.split('.').slice(1);
      setFormData((prev) => {
        const updatedIndustry = [...prev.industry];

        if (key === 'type') {
          updatedIndustry[outerIndex] = {
            ...updatedIndustry[outerIndex],
            [key]: value,
            subCategories: updatedIndustry[outerIndex].subCategories || [],
          };
        } else if (key === 'other') {
          updatedIndustry[outerIndex] = {
            ...updatedIndustry[outerIndex],
            [key]: value,
          };
        } else if (key === 'subCategories') {
          const parts = name.split('.').slice(1);
          const index = parseInt(parts[0], 10);
          const subIndex = parseInt(parts[2], 10);
          // const fieldKey = parts[3];
          updatedIndustry[index].subCategories = updatedIndustry[index].subCategories || [];

          const updatedSubCategories = [...updatedIndustry[index].subCategories];

          if (checked) {

            if (!updatedSubCategories[subIndex]) {
              updatedSubCategories[subIndex] = { type: value };
            } else {
              updatedSubCategories[subIndex] = { ...updatedSubCategories[subIndex], type: value };
            }
          } else {

            updatedSubCategories[subIndex] = { ...updatedSubCategories[subIndex], type: '' };
          }
          const uniqueSubCategories = Array.from(
            new Map(
              updatedSubCategories
                .filter(sub => sub && sub.type && sub.type.trim() !== '')
                .map(sub => [sub.type, sub])
            ).values()
          );

          updatedIndustry[index].subCategories = uniqueSubCategories;


        }
        return { ...prev, industry: updatedIndustry };
      });
    }
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));
    }
  };



  const pastactivitiesAdd = async (users) => {
    const description = [
      formData.name ? `Name: ${formData.name}` : '',
      formData.bio ? `Bio: ${formData.bio}` : '',
      formData.experienceFrom || formData.experienceTo ? `Experience: ${formData.experienceFrom || 'N/A'} to ${formData.experienceTo || 'N/A'}` : '',
      formData.email ? `Email: ${formData.email}` : '',
      formData.expertise && formData.expertise.length ? `Expertise: ${formData.expertise.map(exp => `${exp.type}${exp.other ? ` (${exp.other})` : ''}`).join(', ')}` : '',
      formData.languages && formData.languages.length ? `Languages: ${formData.languages.map(lang => `${lang.name}${lang.other ? ` (${lang.other})` : ''} (${lang.proficiency})`).join(', ')}` : '',
      formData.location ? `Location: ${formData.location}` : '',
      formData.collaborationRates.hourlyRateFrom || formData.collaborationRates.hourlyRateTo ? `hourlyRate Collaboration Rates: ${formData.collaborationRates.hourlyRateFrom || 'N/A'} to ${formData.collaborationRates.hourlyRateTo || 'N/A'}` : '',
      formData.collaborationRates.perWordRateFrom || formData.collaborationRates.perWordRateTo ? `perWordRate Collaboration Rates: ${formData.collaborationRates.perWordRateFrom || 'N/A'} to ${formData.collaborationRates.perWordRateTo || 'N/A'}` : '',
      formData.collaborationRates.projectRateFrom || formData.collaborationRates.projectRateTo ? `projectRate Collaboration Rates: ${formData.collaborationRates.projectRateFrom || 'N/A'} to ${formData.collaborationRates.projectRateTo || 'N/A'}` : '',
      formData.languageProficiency ? `Language Proficiency: ${formData.languageProficiency}` : '',
      formData.verifiedStatus? `Verified : ${formData.verifiedStatus}`: '',
      formData.industry && formData.industry.length ? `Industry: ${formData.industry.map(ind => `${ind.type}${ind.other ? ` (${ind.other})` : ''}${ind.subCategories && ind.subCategories.length ? ` - Subcategories: ${ind.subCategories.map(sub => `${sub.type}${sub.other ? ` (${sub.other})` : ''}`).join(', ')}` : ''}`).join(', ')}` : '',
      `Total results: ${users.length}`
    ]
      .filter(Boolean)
      .join(', ');


    const shortDescription = `You searched Experience from ${formData.experienceFrom || 'N/A'} to ${formData.experienceTo || 'N/A'}, Location: ${formData.location || 'N/A'}, and got ${users.length} results`;
    try {
      const activityData = {
        userId: userData?._id,
        action: "Performed a search for Content Writer",
        section: "Content Writer",
        role: userData?.role,
        timestamp: new Date(),
        details: {
          type: "filter",
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

  const handleSubmit = async (e) => {


    const transformedData = {
      ...formData,

      languages: formData.languages
        .filter(lang => lang.name)
        .map(lang => ({
          name: lang.name === 'Other' ? lang.other : lang.name,
          proficiency: lang.proficiency
        })),
      languageProficiency: formData.languages
        .map(lang => lang.proficiency)
        .find(proficiency => proficiency) || '',
        verifiedStatus: formData.verifiedStatus === "" 
        ? "" 
        : formData.verifiedStatus === "verified"
        ? true 
        : formData.verifiedStatus === "unverified" 
        ? false 
        : "",

    };

  


    e.preventDefault();
    try {
      const response = await axios.post(`${localhosturl}/contentwriters/contentWritersFilter`, { ...transformedData, userId: userData?._id, });

      setWriters(response.data.data);
      console.log(response.data, response.data.data)
      pastactivitiesAdd(response.data.data);
      toast.success("Writer fetching successfully");
    } catch (error) {
      toast.error(`Error fetching filtered writers ${error}`)
      console.error('Error fetching filtered writers:', error);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };




  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

  const industrySubCategories = {
    Technology: ['Software', 'Hardware', 'AI', 'Networking', 'Other'],
    Health: ['Wellness', 'Medical', 'Fitness', 'Nutrition', 'Other'],
    Finance: ['Banking', 'Investments', 'Insurance', 'Accounting', 'Other'],
    Education: ['Online Courses', 'Tutoring', 'Schooling', 'Certification', 'Other'],
    Entertainment: ['Movies', 'Music', 'Games', 'Theatre', 'Other'],
    Fashion: ['Clothing', 'Footwear', 'Accessories', 'Trends', 'Other'],
    Food: ['Cuisine', 'Beverage', 'Diet', 'Restaurants', 'Other'],
    Travel: ['Adventure', 'Luxury', 'Budget', 'Destinations', 'Other'],
    Sports: ['Football', 'Basketball', 'Tennis', 'Cricket', 'Other']
  };



  const location = useLocation();
  const [toastShown, setToastShown] = useState(false);
  useEffect(() => {
    if (location?.state?.formData) {
      const formData = location.state.formData;

      const flattenedFormData = formData["0"] || formData;
      console.log("Flattened FormData", flattenedFormData);

      setFormData(prevState => ({
        ...initialFormData,
        ...flattenedFormData
      }));
      fetchUsers(formData)
      location.state.formData = null;
    }
  }, [location?.state?.formData]);

  const fetchUsers = async (formData) => {
    try {
      const response = await axios.post(
        `${localhosturl}/contentwriters/contentWritersFilter`

        , formData);
      console.log("Fetched data:", response.data.data);
      setWriters(response.data.data);


      if (!toastShown) {
        toast.success("Saved Data Fetch Successfully");
        setToastShown(true);
      }

    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error(error.message);
    }
  }

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({ ...prev, location }));
  };


  return (
    <div className="container mx-auto p-4">

      <h2 className="text-2xl   p-2 my-2">FAQ</h2>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="block">
            <label className="text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>


          <div className="block">
            <label className="text-gray-700">Experience From (years)</label>
            <input
              type="number"
              name="experienceFrom"
              value={formData.experienceFrom}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="block">
            <label className="text-gray-700">Experience To (years)</label>
            <input
              type="number"
              name="experienceTo"
              value={formData.experienceTo}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="block">
            <label className="text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <LocationSelector onSelectLocation={handleLocationSelect} />

          <div className="block">
            <label
            >Industry</label>
            {formData.industry.map((item, outerIndex) => (
              <div key={outerIndex} className="border p-4 mb-4 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <select
                    name={`industry.${outerIndex}.type`}
                    value={item.type}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded w-full"
                  >
                    <option value="">Select Industry</option>
                    {Object.keys(industrySubCategories).map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {item.type === "Other" && (
                    <input
                      type="text"
                      name={`industry.${outerIndex}.other`}
                      value={item.other}
                      onChange={handleChange}
                      placeholder="Other Industry"
                      className="p-2 border border-gray-300 rounded w-2/3"
                    />
                  )}

                </div>
                {item.type && industrySubCategories[item.type] && (
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700">Sub Categories</label>
                    {industrySubCategories[item.type].map((subCategory, innerIndex) => {
                      const isChecked = item?.subCategories.some(sub => sub?.type === subCategory ? true : false);
                      return (
                        <div key={innerIndex} className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            name={`industry.${outerIndex}.subCategories.${innerIndex}.type`}
                            value={subCategory}
                            checked={isChecked}
                            onChange={(e) => handleChange(e, outerIndex, innerIndex)}
                            className="mr-2"
                          />
                          <label className="text-gray-700">{subCategory}</label>
                        </div>
                      );
                    })}

                  </div>
                )}
              </div>
            ))}




          </div>
          <div className="block">
            <label className="text-gray-700">Expertise</label>
            {formData.expertise.map((exp, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <select
                  name={`expertise.${idx}.type`}
                  value={exp.type}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full mr-2"
                >
                  <option value="">Select Expertise</option>
                  <option value="SEO">SEO</option>
                  <option value="Content Marketing">Content Marketing</option>
                  <option value="Technical Writing">Technical Writing</option>
                  <option value="Other">Other</option>
                </select>
                {exp.type === "Other" && (
                  <input
                    type="text"
                    name={`expertise.${idx}.other`}
                    value={exp.other}
                    onChange={handleChange}
                    placeholder="Enter expertise manually"
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                )}


              </div>
            ))}

          </div>
          <div className="block">
            <label className="text-gray-700">Languages</label>
            {formData.languages.map((lang, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <select
                  name={`languages.${idx}.name`}
                  value={lang.name}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full mr-2"
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Other">Other</option>
                </select>
                {lang.name === "Other" && (
                  <input
                    type="text"
                    name={`languages.${idx}.other`}
                    value={lang.other}
                    onChange={handleChange}
                    placeholder="Enter language manually"
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                )}
                <select
                  name={`languages.${idx}.proficiency`}
                  value={lang.proficiency}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full ml-2"
                >
                  <option value="">Select Proficiency</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Native">Native</option>
                </select>

              </div>
            ))}

          </div>
          <div className="flex flex-col">
              <label htmlFor="verifiedStatus">Verified Status</label>
              <select
                id="verifiedStatus"
                name="verifiedStatus"
                value={formData.verifiedStatus}
                onChange={handleChange}
                className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
              >
                <option value="">All</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>


        </div>

        <div className="flex flex-col gap-4" style={{ marginTop: '10px' }}>

  {/* Row 1: Hourly Rate From & To */}
  <div className="flex flex-row gap-4">
    <div className="flex flex-col">
      <label htmlFor="collaborationRates.hourlyRateFrom">
        Collaboration Hourly Rate (From)
      </label>
      <input
        type="number"
        id="collaborationRates.hourlyRateFrom"
        name="collaborationRates.hourlyRateFrom"
        min="0"
        value={formData.collaborationRates.hourlyRateFrom}
        onChange={handleChange}
        className="focus:outline focus:outline-blue-400 p-2 w-64"
      />
    </div>
    <div className="flex flex-col">
      <label htmlFor="collaborationRates.hourlyRateTo">
        Collaboration Hourly Rate (To)
      </label>
      <input
        type="number"
        id="collaborationRates.hourlyRateTo"
        name="collaborationRates.hourlyRateTo"
        min="0"
        value={formData.collaborationRates.hourlyRateTo}
        onChange={handleChange}
        className="focus:outline focus:outline-blue-400 p-2 w-64"
      />
    </div>
  </div>

  {/* Row 2: Per Word Rate From & To */}
  <div className="flex flex-row gap-4">
    <div className="flex flex-col">
      <label htmlFor="collaborationRates.perWordRateFrom">
        Collaboration Per Word Rate (From)
      </label>
      <input
        type="number"
        id="collaborationRates.perWordRateFrom"
        name="collaborationRates.perWordRateFrom"
        min="0"
        value={formData.collaborationRates.perWordRateFrom}
        onChange={handleChange}
        className="focus:outline focus:outline-blue-400 p-2 w-64"
      />
    </div>
    <div className="flex flex-col">
      <label htmlFor="collaborationRates.perWordRateTo">
        Collaboration Per Word Rate (To)
      </label>
      <input
        type="number"
        id="collaborationRates.perWordRateTo"
        name="collaborationRates.perWordRateTo"
        min="0"
        value={formData.collaborationRates.perWordRateTo}
        onChange={handleChange}
        className="focus:outline focus:outline-blue-400 p-2 w-64"
      />
    </div>
  </div>

  {/* Row 3: Project Rate From & To */}
  <div className="flex flex-row gap-4">
    <div className="flex flex-col">
      <label htmlFor="collaborationRates.projectRateFrom">
        Collaboration Project Rate (From)
      </label>
      <input
        type="number"
        id="collaborationRates.projectRateFrom"
        name="collaborationRates.projectRateFrom"
        min="0"
        value={formData.collaborationRates.projectRateFrom}
        onChange={handleChange}
        className="focus:outline focus:outline-blue-400 p-2 w-64"
      />
    </div>
    <div className="flex flex-col">
      <label htmlFor="collaborationRates.projectRateTo">
        Collaboration Project Rate (To)
      </label>
      <input
        type="number"
        id="collaborationRates.projectRateTo"
        name="collaborationRates.projectRateTo"
        min="0"
        value={formData.collaborationRates.projectRateTo}
        onChange={handleChange}
        className="focus:outline focus:outline-blue-400 p-2 w-64"
      />
    </div>
  </div>
</div>


        <div className="flex items-center justify-end space-x-2 mt-3">
          <SaveSearch section="ContenWriters" formDataList={formData} />
          <button
            type="reset"
            onClick={handleReset}
            className="py-2 px-4 bg-gray-900 text-white rounded transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105"
          >
            Reset
          </button>
          <button
            disabled={!userData.permissions.contentWriter.filter}
            title={!userData.permissions.contentWriter.filter
              ? "You are not allowed to access this feature"
              : undefined
            }
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded transition duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105"
          >
            Search
          </button>
        </div>
      </form>
      <div className="mt-4">
        <h2 className="text-xl   p-2 my-2"
        >
          Content Writer List
        </h2>

        <ContentWriterTable contentWriters={writers} setContentWriters={setWriters} />
      </div>
    </div>
  );
};

export default ContentWriter;