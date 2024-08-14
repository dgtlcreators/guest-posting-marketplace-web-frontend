import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeProvider';


const EditContentWriter = () => {
  const { isDarkTheme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    experience: 0,
    location: "",
    expertise: [{ type: "", other: "" }],
    languages: [{ name: "", other: "", proficiency: "" }],
    collaborationRates: { post: 0, story: 0, reel: 0 },
    email: "",
    industry: [{ type: '', other: '', subCategories: [{ type: '', other: '' }] }],
  });

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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://guest-posting-marketplace-web-backend.onrender.com/contentwriters/getcontentwriter/${id}`);
       // const response = await axios.get(`http://localhost:5000/contentwriters/getcontentwriter/${id}`);
        const writer = response.data.data;

        setFormData({
          name: writer.name || '',
          email: writer.email || '',
          bio: writer.bio || '',
          experience: writer.experience || 0,
          location: writer.location || "",
          expertise: writer.expertise && Array.isArray(writer.expertise) ? writer.expertise : [{ type: "", other: "" }],
          languages: writer.languages && Array.isArray(writer.languages) ? writer.languages : [{ name: "", other: "", proficiency: "" }],
          collaborationRates: {
            post: writer.collaborationRates?.post || 0,
            story: writer.collaborationRates?.story || 0,
            reel: writer.collaborationRates?.reel || 0,
          },
          industry: writer.industry && Array.isArray(writer.industry) ? writer.industry: [{ type: '', other: '', subCategories: [{ type: '', other: '' }] }],
          
        });
      } catch (error) {
        console.error('Error fetching writer data:', error);
      }
    };

    fetchData();
  }, [id]);

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


  const handleAddLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { name: "", other: "", proficiency: "" }],
    }));
  };

  const handleRemoveLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const handleAddExpertise = () => {
    setFormData(prev => ({
      ...prev,
      expertise: [...prev.expertise, { type: "", other: "" }],
    }));
  };

  const handleRemoveExpertise = (index) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  const validateLanguages = (languages) => {
    for (let i = 0; i < languages.length; i++) {
      if (!languages[i].name) {
        toast.error(`Language name cannot be empty at index ${i + 1}`);
        return false;
      }
      if (!languages[i].proficiency) {
        toast.error(`Proficiency cannot be empty for language at index ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const validateLanguages1 = (languages) => {
    for (let i = 0; i < languages.length; i++) {
      const { name, proficiency } = languages[i];
      if ((name && !proficiency) || (!name && proficiency)) {
        toast.error(`Both language name and proficiency must be filled for language at index ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const validateExpertise = (expertise) => {
    for (let i = 0; i < expertise.length; i++) {
      const { type } = expertise[i];
      if (!type) {
        toast.error(`Expertise type cannot be empty at index ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const validateIndustry = (industry) => {
    if (industry.length === 0) {
     // alert("Please add at least one industry.");
     // return false;
    }
    for (const ind of industry) {
      if (ind.subCategories.length === 0 || !ind.subCategories.every(sub => sub.type)) {
        alert("Please ensure all industries have valid subcategories.");
        return false;
      }
    }
    return true;
  };

  const validateIndustry1 = (industry) => {
    if (!Array.isArray(industry)) return false;
    return industry.every(
      ind => ind && ind.type && ind.type.trim() !== '' && ind._id
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedExpertise = formData.expertise.filter(exp => exp.type);
    const cleanedLanguages = formData.languages.filter(lang => lang.name && lang.proficiency);
  //  const cleanedIndustry = formData?.industry?.filter(ind => ind?.type && ind?.subCategories?.every(sub =>sub.type && sub.type));
  const cleanedIndustry1 = formData?.industry?.filter(ind => ind && ind.type  && ind.type.trim() !== '' && ind.subCategories?.every(sub => sub?.type));
  const cleanedIndustry = formData?.industry?.filter(ind => ind && ind.type && ind.type.trim() !== '' && ind.subCategories?.every(sub => sub?.type))
  .map(ind => ({
    ...ind,
    subCategories: ind.subCategories.filter(sub => sub && sub.type && sub.type.trim() !== '')
  }));

  
  if (!validateExpertise(cleanedExpertise) || !validateLanguages(cleanedLanguages) ||  !validateIndustry(cleanedIndustry)
    ) {
      return;
    }

    try {
      const response = await axios.put(`https://guest-posting-marketplace-web-backend.onrender.com/contentwriters/updatecontentwriter/${id}`, {
     // const response = await axios.put(`http://localhost:5000/contentwriters/updatecontentwriter/${id}`, {
        ...formData,
        expertise: cleanedExpertise,
        languages: cleanedLanguages,
        industry:formData.industry.filter(item => item.type),
      });
      toast.success("Writer updated successfully");
      navigate("/addContentWriters");
      console.log('Writer updated successfully:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(`Error updating writer: ${error.response.data.message || error.message}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        toast.error(`Error updating writer: No response from server`);
      } else {
        console.error('Error setting up request:', error.message);
        toast.error(`Error updating writer: ${error.message}`);
      }
    }
  };

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
        updatedLanguages[index][key] = value;
        return { ...prev, languages: updatedLanguages };
      });
    } else if (name.startsWith('expertise')) {
      const [index, key] = name.split('.').slice(1);
      setFormData((prev) => {
        const updatedExpertise = [...prev.expertise];
        updatedExpertise[index][key] = value;
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
 //   const subIndex = parts.length > -1 ? parseInt(parts[2], 10) : null;
    const fieldKey = parts[3]; 
    updatedIndustry[index].subCategories = updatedIndustry[index].subCategories || [];

   
    const updatedSubCategories = [...updatedIndustry[index].subCategories];
//console.log(checked)
    if (checked) {
       
        if (!updatedSubCategories[subIndex]) {
            updatedSubCategories[subIndex] = { type: value };
        } else {
            updatedSubCategories[subIndex] = { ...updatedSubCategories[subIndex], type: value };
        }
    } else {
        
        updatedSubCategories[subIndex] = { ...updatedSubCategories[subIndex], type: '' };
    }
  //  const uniqueSubCategories1 = Array.from(
   //   new Map(updatedSubCategories.map(item => [item?.type, item])).values()
   // );

    //updatedIndustry[index].subCategories = uniqueSubCategories.filter(sub => sub && sub.type && sub.type.trim() !== '');

   // updatedIndustry[index].subCategories = updatedSubCategories;
   //updatedIndustry[index].subCategories = updatedSubCategories.filter(sub => sub && sub.type && sub.type.trim() !== '');
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Update Content Writer</h1>
      <form onSubmit={handleSubmit} className="mb-4 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="block">
            <span className="text-gray-700">Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Bio</span>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Location</span>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Experience</span>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <div className="block">
          <h2 className="text-xl font-bold text-blue-600">Industry</h2>
          {formData?.industry?.map((item, outerIndex) => (
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
          //  const isChecked = item.subCategories.some(sub => sub.type === subCategory);
          const isChecked = item?.subCategories && item?.subCategories?.some(sub => sub?.type === subCategory?true:false);
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
                  <option value="Copywriting">Copywriting</option>
                  <option value="Other">Other</option>
                </select>
                {exp.type === 'Other' && (
                  <input
                    type="text"
                    name={`expertise.${idx}.other`}
                    value={exp.other}
                    onChange={handleChange}
                    placeholder="Specify other"
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                )}
                <button type="button" onClick={() => handleRemoveExpertise(idx)} className="ml-2 bg-red-500 text-white py-1 px-2 rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddExpertise} className="mt-2 bg-green-500 text-white py-2 px-4 rounded">Add Expertise</button>
          </label>
          <label className="block col-span-2">
            <span className="text-gray-700">Languages</span>
            {formData.languages.map((lang, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <select
                  name={`languages.${idx}.name`}
                  value={lang.name}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full md:w-1/2 lg:w-1/3 mr-2 mb-2 md:mb-0"
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Other">Other</option>
                </select>
                {lang.name === 'Other' && (
                  <input
                    type="text"
                    name={`languages.${idx}.other`}
                    value={lang.other}
                    onChange={handleChange}
                    placeholder="Specify other"
                    className="p-2 border border-gray-300 rounded w-full md:w-1/2 lg:w-1/3 mr-2 mb-2 md:mb-0"
                  />
                )}
               <select
                name={`languages.${idx}.proficiency`}
                value={lang.proficiency}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full md:w-1/2 lg:w-1/3 mr-2 mb-2 md:mb-0"
              >
                <option value="">Select Proficiency</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Native">Native</option>
              </select>
                <button type="button" onClick={() => handleRemoveLanguage(idx)} className="ml-2 bg-red-500 text-white py-1 px-2 rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddLanguage} className="ml-2 bg-blue-500 text-white py-1 px-2 rounded">Add Language</button>
          </label>
          <label className="block">
            <span className="text-gray-700">Collaboration Rates (Post)</span>
            <input
              type="number"
              name="collaborationRates.post"
              value={formData.collaborationRates.post}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Collaboration Rates (Story)</span>
            <input
              type="number"
              name="collaborationRates.story"
              value={formData.collaborationRates.story}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Collaboration Rates (Reel)</span>
            <input
              type="number"
              name="collaborationRates.reel"
              value={formData.collaborationRates.reel}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
        </div>
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">Update Writer</button>
      </form>
    </div>
  );
};

export default EditContentWriter;

