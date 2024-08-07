import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditContentWriter = () => {
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
  });

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
        });
      } catch (error) {
        console.error('Error fetching writer data:', error);
      }
    };

    fetchData();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedExpertise = formData.expertise.filter(exp => exp.type);
    const cleanedLanguages = formData.languages.filter(lang => lang.name && lang.proficiency);

    if (!validateExpertise(cleanedExpertise) || !validateLanguages(cleanedLanguages)) {
      return;
    }

    try {
      const response = await axios.put(`https://guest-posting-marketplace-web-backend.onrender.com/contentwriters/updatecontentwriter/${id}`, {
     // const response = await axios.put(`http://localhost:5000/contentwriters/updatecontentwriter/${id}`, {
        ...formData,
        expertise: cleanedExpertise,
        languages: cleanedLanguages,
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
    const { name, value, type } = e.target;

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
    } else {
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












/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditContentWriter = () => {
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
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/contentwriters/getcontentwriter/${id}`);
        const writer = response.data.data;

        setFormData({
          name: writer.name || '',
          email: writer.email || '',
          bio: writer.bio || '',
          experience: writer.experience || 0,
          location:writer.location || "",
          expertise: writer.expertise && Array.isArray(writer.expertise) ? writer.expertise : [{ type: "", other: "" }],
          languages: writer.languages && Array.isArray(writer.languages) ? writer.languages : [{ name: "", other: "", proficiency: "" }],
          collaborationRates: {
            post: writer.collaborationRates?.post || 0,
            story: writer.collaborationRates?.story || 0,
            reel: writer.collaborationRates?.reel || 0,
          },
        });
      } catch (error) {
        console.error('Error fetching writer data:', error);
      }
    };

    fetchData();
  }, [id]);

  

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

  const handleSubmit = async (e) => {
    e.preventDefault();
   // console.log('Form data before submission:', formData); 
    try {
      const response = await axios.put(`http://localhost:5000/contentwriters/updatecontentwriter/${id}`, formData);
      toast.success("Writer updated successfully");
      navigate("/addContentWriters");
      console.log('Writer updated successfully:', response.data);
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error('Error response:', error.response.data);
        toast.error(`Error updating writer: ${error.response.data.message || error.message}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Error request:', error.request);
        toast.error(`Error updating writer: No response from server`);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
        toast.error(`Error updating writer: ${error.message}`);
      }
    }
  };
  const handleChange = (e) => {
    const { name, value, type } = e.target;

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
      console.log(`Updating ${key} for language at index ${index} to ${value}`);
      setFormData((prev) => {
        const updatedLanguages = [...prev.languages];
       
        if (key === 'name') {
          // Ensure unique language names
          if (value === "Other" || !updatedLanguages.some((lang, idx) => idx !== index && lang.name === value)) {
            updatedLanguages[index][key] = value;
          
          }
        } else {
          updatedLanguages[index][key] = value;
        }
       // updatedLanguages[index][key] = value;
        console.log(updatedLanguages);  
        return { ...prev, languages: updatedLanguages };
      });
    } else if (name.startsWith('expertise')) {
      const [index, key] = name.split('.').slice(1);

      setFormData((prev) => {
        const updatedExpertise = [...prev.expertise];
       // updatedExpertise[index][key] = value;
       if (key === 'type') {
        // Ensure type is unique
        if (value === "Other" || !updatedExpertise.some((exp, idx) => idx !== index && exp.type === value)) {
          updatedExpertise[index][key] = value;
        }
      } else {
        updatedExpertise[index][key] = value;
      }
   
        return { ...prev, expertise: updatedExpertise };
      });
    } else {
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
      <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Update Content Writer
        </button>
    </form>
    </div>
  );
};

export default EditContentWriter;
*/


