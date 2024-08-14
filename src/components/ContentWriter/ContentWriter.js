import React, { useState } from 'react';
import axios from 'axios';
import ContentWriterTable from './ContentWriterTable';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeProvider';


const ContentWriter = () => {
  const { isDarkTheme } = useTheme();
  const [formData, setFormData] = useState({
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
  });
  


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

  const handleSubmit = async (e) => {
   // console.log(formData)
    /*const transformedData = {
      ...formData,
      expertise: formData.expertise.map(exp => exp.type === 'Other' ? exp.other : exp.type).filter(Boolean),
      languages: formData.languages.map(lang => lang.name === 'Other' ? lang.other : lang.name).filter(Boolean)
    };*/
    const transformedData = {
      ...formData,
      expertise: formData.expertise
        .map(exp => exp.type === 'Other' ? exp.other : exp.type)
        .filter(Boolean),
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
      const response = await axios.post('https://guest-posting-marketplace-web-backend.onrender.com/contentwriters/contentWritersFilter', transformedData);
      //const response = await axios.post('http://localhost:5000/contentwriters/contentWritersFilter', transformedData);
      setWriters(response.data.data);
      toast.success("Writer fetching successfully");
    } catch (error) {
      toast.error(`Error fetching filtered writers ${error}`)
      console.error('Error fetching filtered writers:', error);
    }
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


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Filter Content Writers</h1>
     
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="text-gray-700">Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Bio</span>
            <input
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Location</span>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Experience From (years)</span>
            <input
              type="number"
              name="experienceFrom"
              value={formData.experienceFrom}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Experience To (years)</span>
            <input
              type="number"
              name="experienceTo"
              value={formData.experienceTo}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
         
          <div className="block">
          <h2 className="text-xl font-bold text-blue-600">Industry</h2>
          {formData.industry.map((item, outerIndex) => (
            <div key={outerIndex} className="border p-4 mb-4 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <select
                  name={`industry.${outerIndex}.type`}
                  value={item.type}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-1/3"
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
                <button
                  type="button"
                  onClick={() => handleRemoveIndustry(outerIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove Industry
                </button>
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
                    <span className="text-gray-700">{subCategory}</span>
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
          <button
            type="button"
            onClick={handleAddIndustry}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Industry
          </button>
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
          <label className="block">
            <span className="text-gray-700">Expertise</span>
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
                <button
                  type="button"
                  onClick={() => handleRemoveExpertise(idx)}
                  className="ml-2 bg-red-500 text-white py-1 px-2 rounded"
                >
                  Remove
                </button>
                
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddExpertise}
              className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
            >
              Add Expertise
            </button>
          </label>
          <label className="block">
            <span className="text-gray-700">Languages</span>
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
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(idx)}
                  className="ml-2 bg-red-500 text-white py-1 px-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLanguage}
              className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
            >
              Add Language
            </button>
          </label>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Collaboration Rates</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-gray-700">Post From ($)</span>
              <input
                type="number"
                name="collaborationRates.postFrom"
                value={formData.collaborationRates.postFrom}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Post To ($)</span>
              <input
                type="number"
                name="collaborationRates.postTo"
                value={formData.collaborationRates.postTo}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Story From ($)</span>
              <input
                type="number"
                name="collaborationRates.storyFrom"
                value={formData.collaborationRates.storyFrom}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Story To ($)</span>
              <input
                type="number"
                name="collaborationRates.storyTo"
                value={formData.collaborationRates.storyTo}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Reel From ($)</span>
              <input
                type="number"
                name="collaborationRates.reelFrom"
                value={formData.collaborationRates.reelFrom}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Reel To ($)</span>
              <input
                type="number"
                name="collaborationRates.reelTo"
                value={formData.collaborationRates.reelTo}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Filter Writers
        </button>
      </form>

  
     <ContentWriterTable contentWriters={writers} setContentWriters={setWriters}/>
    </div>
  );
};

export default ContentWriter;


