import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ContentWriterTable from './ContentWriterTable';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeProvider';
import { UserContext } from '../../context/userContext';
import SaveSearch from "../OtherComponents/SaveSearch.js";
import { useLocation } from 'react-router-dom';


const ContentWriter = () => {
  const { isDarkTheme } = useTheme();
  const { userData,localhosturl } = useContext(UserContext);
  const userId = userData?._id;
  const initialFormData={
    userId:userData?._id,
    name: '',
    bio: '',
    experienceFrom: '',
    experienceTo: '',
    email: '',
    expertise: [{ type: '', other: '' }],
    languages: [{ name: '', other: '', proficiency: '' }],
    location: "",
    collaborationRates: {
      postFrom: '',
      postTo: '',
      storyFrom: '',
      storyTo: '',
      reelFrom: '',
      reelTo: ''
    },
    languageProficiency: '',
    industry: [{ type: '', other: '', subCategories: [{ type: '', other: '' }] }],
    //industry: [{ type: '', other: '' }],
    //subCategories: [{ type: '', other: '' }]
  }
  const [formData, setFormData] = useState(initialFormData);
  


  const [writers, setWriters] = useState([]);

  const handleChange = (e) => {
    const { name, value, type,checked } = e.target;

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
          //console.log("key: ",key)
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
    const fieldKey = parts[3]; 
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

    //updatedIndustry[index].subCategories = updatedSubCategories;
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

  const handleAddExpertise = () => {
    setFormData({
      ...formData,
      expertise: [...formData.expertise, { type: '', other: '' }]
    });
  };

  const handleRemoveExpertise = (index) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((_, idx) => idx !== index)
    });
  };

  const handleAddLanguage = () => {
    setFormData({
      ...formData,
      languages: [...formData.languages, { name: '', other: '', proficiency: '' }]
    });
  };

  const handleRemoveLanguage = (index) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, idx) => idx !== index)
    });
  };

  const pastactivitiesAdd=async(users)=>{
    const description = [
      formData.name ? `Name: ${formData.name}` : '',
    formData.bio ? `Bio: ${formData.bio}` : '',
    formData.experienceFrom || formData.experienceTo ? `Experience: ${formData.experienceFrom || 'N/A'} to ${formData.experienceTo || 'N/A'}` : '',
    formData.email ? `Email: ${formData.email}` : '',
    formData.expertise && formData.expertise.length ? `Expertise: ${formData.expertise.map(exp => `${exp.type}${exp.other ? ` (${exp.other})` : ''}`).join(', ')}` : '',
    formData.languages && formData.languages.length ? `Languages: ${formData.languages.map(lang => `${lang.name}${lang.other ? ` (${lang.other})` : ''} (${lang.proficiency})`).join(', ')}` : '',
    formData.location ? `Location: ${formData.location}` : '',
    formData.collaborationRates.postFrom || formData.collaborationRates.postTo ? `Post Collaboration Rates: ${formData.collaborationRates.postFrom || 'N/A'} to ${formData.collaborationRates.postTo || 'N/A'}` : '',
    formData.collaborationRates.storyFrom || formData.collaborationRates.storyTo ? `Story Collaboration Rates: ${formData.collaborationRates.storyFrom || 'N/A'} to ${formData.collaborationRates.storyTo || 'N/A'}` : '',
    formData.collaborationRates.reelFrom || formData.collaborationRates.reelTo ? `Reel Collaboration Rates: ${formData.collaborationRates.reelFrom || 'N/A'} to ${formData.collaborationRates.reelTo || 'N/A'}` : '',
    formData.languageProficiency ? `Language Proficiency: ${formData.languageProficiency}` : '',
    formData.industry && formData.industry.length ? `Industry: ${formData.industry.map(ind => `${ind.type}${ind.other ? ` (${ind.other})` : ''}${ind.subCategories && ind.subCategories.length ? ` - Subcategories: ${ind.subCategories.map(sub => `${sub.type}${sub.other ? ` (${sub.other})` : ''}`).join(', ')}` : ''}`).join(', ')}` : '',
    `Total results: ${users.length}`
    ]
    .filter(Boolean)
    .join(', ');
  
    // Short description focusing on key fields
    const shortDescription = `You searched Experience from ${formData.experienceFrom || 'N/A'} to ${formData.experienceTo || 'N/A'}, Location: ${formData.location || 'N/A'}, and got ${users.length} results`;
    try {
    const activityData={
      userId:userData?._id,
      action:"Performed a search for Content Writer",//"Searched for Instagram Influencers",
      section:"Content Writer",
      role:userData?.role,
      timestamp:new Date(),
      details:{
        type:"filter",
        filter:{formData,total:users.length},
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
   // console.log(formData)
    /*const transformedData = {
      ...formData,
      expertise: formData.expertise.map(exp => exp.type === 'Other' ? exp.other : exp.type).filter(Boolean),
      languages: formData.languages.map(lang => lang.name === 'Other' ? lang.other : lang.name).filter(Boolean)
    };*/
   
    const transformedData = {
      ...formData,
      //expertise: formData.expertise
       // .map(exp => exp.type === 'Other' ? exp.other : exp.type)
       // .filter(Boolean),
      languages: formData.languages
        .filter(lang => lang.name) 
        .map(lang => ({
          name: lang.name === 'Other' ? lang.other : lang.name,
          proficiency: lang.proficiency
        })),
      languageProficiency: formData.languages
        .map(lang => lang.proficiency)
        .find(proficiency => proficiency) || '' ,
        
    };

    
    e.preventDefault();
    try {
      const response = await axios.post(`${localhosturl}/contentwriters/contentWritersFilter`,{... transformedData,userId:userData?._id,});
      
      setWriters(response.data.data);
      console.log(response.data,response.data.data)
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



 
  const handleAddIndustry = () => {
    setFormData((prev) => ({
      ...prev,
      industry: [...prev.industry, { type: "", other: "", subCategories: [] }]
    }));
  };

  const handleRemoveIndustry = (index) => {
    setFormData((prev) => ({
      ...prev,
      industry: prev.industry.filter((_, i) => i !== index),
    }));
  };

  const handleAddSubCategory = (index) => {
    setFormData((prev) => {
      const updatedIndustry = [...prev.industry];
      updatedIndustry[index].subCategories = [...updatedIndustry[index].subCategories, { type: "", other: "" }];
      return { ...prev, industry: updatedIndustry };
    });
  };

  const handleRemoveSubCategory = (outerIdx, innerIdx) => {
    setFormData((prev) => {
      const updatedIndustry = [...prev.industry];
      updatedIndustry[outerIdx].subCategories = updatedIndustry[outerIdx].subCategories.filter((_, i) => i !== innerIdx);
      return { ...prev, industry: updatedIndustry };
    });
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
  
const fetchUsers=async(formData)=>{
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
   // toast.success("Saved Data Fetch Successfully");
  } catch (error) {
    console.log("Error fetching data:", error);
    toast.error(error.message);
  }
}


  return (
    <div className="container mx-auto p-4">
      {/*<h1 className="text-2xl font-bold mb-6 text-blue-600">Filter Content Writers</h1>*/}
      <h1 className="text-2xl   p-2 my-2">FAQ</h1>
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
          {/*<div className="block">
            <label className="text-gray-700">Bio</label>
            <input
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>*/}
        
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
          <div className="block">
            <label className="text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="block">
          <label //className="text-xl font-bold text-blue-600"
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
                {/*<button
                  type="button"
                  onClick={() => handleRemoveIndustry(outerIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove Industry
                </button>*/}
              </div>
              {item.type && industrySubCategories[item.type] && (
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700">Sub Categories</label>
                  {industrySubCategories[item.type].map((subCategory, innerIndex) => {
            const isChecked = item?.subCategories.some(sub => sub?.type === subCategory?true:false);
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
                 {/* <button
                    type="button"
                    onClick={() => handleAddSubCategory(outerIndex)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    Add Sub Category
                  </button>*/}
                </div>
              )}
            </div>
          ))}
          {/*<button
            type="button"
            onClick={handleAddIndustry}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Industry
          </button>*/}
        
      
          
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
               {/* <button
                  type="button"
                  onClick={() => handleRemoveExpertise(idx)}
                  className="ml-2 bg-red-500 text-white py-1 px-2 rounded"
                >
                  Remove
                </button>*/}
                
              </div>
            ))}
           {/* <button
              type="button"
              onClick={handleAddExpertise}
              className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
            >
              Add Expertise
            </button>*/}
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
               { /*<button
                  type="button"
                  onClick={() => handleRemoveLanguage(idx)}
                  className="ml-2 bg-red-500 text-white py-1 px-2 rounded"
                >
                  Remove
                </button>*/}
              </div>
            ))}
           { /*<button
              type="button"
              onClick={handleAddLanguage}
              className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
            >
              Add Language
            </button>*/}
          </div>

        {/*<div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Collaboration Rates</h2>*/}
         
            {/*<div className="block">
              <label className="text-gray-700">Collaboration Rates Post (From)</label>
              <input
                type="number"
                name="collaborationRates.postFrom"
                value={formData.collaborationRates.postFrom}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="block">
              <label className="text-gray-700">Collaboration Rates Post (To)</label>
              <input
                type="number"
                name="collaborationRates.postTo"
                value={formData.collaborationRates.postTo}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="block">
              <label className="text-gray-700">Collaboration Rates Story (From)</label>
              <input
                type="number"
                name="collaborationRates.storyFrom"
                value={formData.collaborationRates.storyFrom}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="block">
              <label className="text-gray-700">Collaboration Rates Story (To)</label>
              <input
                type="number"
                name="collaborationRates.storyTo"
                value={formData.collaborationRates.storyTo}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="block">
              <label className="text-gray-700">Collaboration Rates Reel (From)</label>
              <input
                type="number"
                name="collaborationRates.reelFrom"
                value={formData.collaborationRates.reelFrom}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="block">
              <label className="text-gray-700">Collaboration Rates Reel (To)</label>
              <input
                type="number"
                name="collaborationRates.reelTo"
                value={formData.collaborationRates.reelTo}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>*/}
            
      {/*</div>*/}
       
        </div>
         { /*<label className='block'>
          <span className="text-gray-700">Industry</span>
          {formData.industry.map((ids,idx)=>(
            <div key={idx} className='flex items-center mb-2'>
              <select
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          value={selectedIndustry}
          onChange={handleIndustryChange}
        >
          <option value="">Select Industry</option>
          {Object.keys(industrySubCategories).map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
              {ids.type==="Other" && (
                  <input
                    type="text"
                    name={`industry.${idx}.other`}
                    value={ids.other}
                    onChange={handleChange}
                    placeholder="Enter Industry manually"
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                )}
            </div>
          ))}
                {subCategories.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Sub-categories</label>
          <div className="mt-1">
            {formData.subCategories.map((subCategory) => (
              <div key={subCategory} className="flex items-center">
                <input
                  type="checkbox"
                  id={subCategory}
                  value={subCategory}
                  onChange={handleSubCategoryChange}
                  className="mr-2"
                />
                <label htmlFor={subCategory} className="text-sm text-gray-700">
                  {subCategory}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

          </label>*/}
         

      <div className="flex items-center justify-end space-x-2 mt-3">       
           <SaveSearch  section="ContenWriters" formDataList={formData}/>
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
             : undefined  // : ""
           }
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded transition duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105"
          >
            Search
          </button>
        </div>
      </form>
      <div className="mt-4">
          <h2 className="text-xl   p-2 my-2"// text-white bg-blue-700 
        >
          Content Writer List
          </h2>
  
     <ContentWriterTable contentWriters={writers} setContentWriters={setWriters}/>
     </div>
    </div>
  );
};

export default ContentWriter;


