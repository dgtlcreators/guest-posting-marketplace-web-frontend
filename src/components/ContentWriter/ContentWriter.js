import React, { useState } from 'react';
import axios from 'axios';
import ContentWriterTable from './ContentWriterTable';
import { toast } from 'react-toastify';

const ContentWriter = () => {
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
    languageProficiency: ''
  });

  const [writers, setWriters] = useState([]);

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
    } else {
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
        .filter(lang => lang.name) // Filter out any languages without a name
        .map(lang => ({
          name: lang.name === 'Other' ? lang.other : lang.name,
          proficiency: lang.proficiency
        })),
      languageProficiency: formData.languages
        .map(lang => lang.proficiency)
        .find(proficiency => proficiency) || '' 
    };
    
    e.preventDefault();
    try {
      const response = await axios.post('https://guest-posting-marketplace-web-backend.onrender.com/contentwriters/contentWritersFilter', transformedData);
     // const response = await axios.post('http://localhost:5000/contentwriters/contentWritersFilter', transformedData);
      setWriters(response.data.data);
      toast.success("Writer fetching successfully");
    } catch (error) {
      toast.error(`Error fetching filtered writers ${error}`)
      console.error('Error fetching filtered writers:', error);
    }
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

     {/*<div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Filtered Content Writers</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Bio</th>
              <th className="px-4 py-2 border">Experience</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Expertise</th>
              <th className="px-4 py-2 border">Languages</th>
              <th className="px-4 py-2 border">Collaboration Rates</th>
            </tr>
          </thead>
          <tbody>
            {writers.map((writer) => (
              <tr key={writer.id}>
                <td className="px-4 py-2 border">{writer.name}</td>
                <td className="px-4 py-2 border">{writer.bio}</td>
                <td className="px-4 py-2 border">{writer.experience}</td>
                <td className="px-4 py-2 border">{writer.email}</td>
                <td className="px-4 py-2 border">
                  {writer.expertise.map((exp, idx) => (
                    <div key={idx}>{exp.type}{exp.type === "Other" && `: ${exp.other}`}</div>
                  ))}
                </td>
                <td className="px-4 py-2 border">
                  {writer.languages.map((lang, idx) => (
                    <div key={idx}>{lang.name}{lang.name === "Other" && `: ${lang.other}`}, {lang.proficiency}</div>
                  ))}
                </td>
                <td className="px-4 py-2 border">
                  Post: ${writer.collaborationRates.postFrom} - ${writer.collaborationRates.postTo} <br />
                  Story: ${writer.collaborationRates.storyFrom} - ${writer.collaborationRates.storyTo} <br />
                  Reel: ${writer.collaborationRates.reelFrom} - ${writer.collaborationRates.reelTo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
     <ContentWriterTable contentWriters={writers} setContentWriters={setWriters}/>
    </div>
  );
};

export default ContentWriter;





/*import React, { useState } from 'react';
import axios from 'axios';

const ContentWriter = () => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    experienceFrom: '',
    experienceTo: '',
    email: '',
    expertise: [{ type: '', other: '' }],
    languages: [{ name: '', other: '', proficiency: '' }],
    collaborationRates: {
      postFrom: '',
      postTo: '',
      storyFrom: '',
      storyTo: '',
      reelFrom: '',
      reelTo: ''
    }
  });

  const [writers, setWriters] = useState([]);

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
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/contentwriters/contentWritersFilter', formData);
      setWriters(response.data.data);
    } catch (error) {
      console.error('Error fetching filtered writers:', error);
    }
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
            <span className="text-gray-700">Collaboration Rates</span>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700">Post From</span>
                <input
                  type="number"
                  name="collaborationRates.postFrom"
                  value={formData.collaborationRates.postFrom}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Post To</span>
                <input
                  type="number"
                  name="collaborationRates.postTo"
                  value={formData.collaborationRates.postTo}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Story From</span>
                <input
                  type="number"
                  name="collaborationRates.storyFrom"
                  value={formData.collaborationRates.storyFrom}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Story To</span>
                <input
                  type="number"
                  name="collaborationRates.storyTo"
                  value={formData.collaborationRates.storyTo}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Reel From</span>
                <input
                  type="number"
                  name="collaborationRates.reelFrom"
                  value={formData.collaborationRates.reelFrom}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Reel To</span>
                <input
                  type="number"
                  name="collaborationRates.reelTo"
                  value={formData.collaborationRates.reelTo}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
            </div>
          </label>
        </div>
        <button
          type="submit"
          className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Search
        </button>
      </form>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4 text-blue-600">Filtered Content Writers</h2>
        <ul className="list-disc list-inside">
          {writers.map((writer) => (
            <li key={writer._id} className="mb-4 p-4 border border-gray-200 rounded-md">
              <h3 className="text-lg font-semibold text-blue-700">{writer.name}</h3>
              <p className="text-gray-700">Bio: {writer.bio}</p>
              <p className="text-gray-700">Experience: {writer.experience} years</p>
              <p className="text-gray-700">Expertise: {writer.expertise.join(', ')}</p>
              <p className="text-gray-700">Languages: {writer.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}</p>
              <p className="text-gray-700">Collaboration Rates: Post: {writer.collaborationRates.postFrom} - {writer.collaborationRates.postTo}, Story: {writer.collaborationRates.storyFrom} - {writer.collaborationRates.storyTo}, Reel: {writer.collaborationRates.reelFrom} - {writer.collaborationRates.reelTo}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContentWriter;*/







/*import React, { useState } from 'react';
import axios from 'axios';

const ContentWriter = () => {
  const [filters, setFilters] = useState({
    name: '',
    bio: '',
    experienceFrom: '',
    experienceTo: '',
    email: '',
    expertise: '',
    languages: '',
    languageProficiency: '',
    collaborationRates: {
      postFrom: '',
      postTo: '',
      storyFrom: '',
      storyTo: '',
      reelFrom: '',
      reelTo: ''
    }
  });

  const [writers, setWriters] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFilters({
        ...filters,
        [parent]: {
          ...filters[parent],
          [child]: value
        }
      });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/contentwriters/contentWritersFilter', filters);
      setWriters(response.data.data);
    } catch (error) {
      console.error('Error fetching filtered writers:', error);
    }
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
              value={filters.name}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Bio</span>
            <input
              type="text"
              name="bio"
              value={filters.bio}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Experience From (years)</span>
            <input
              type="number"
              name="experienceFrom"
              value={filters.experienceFrom}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Experience To (years)</span>
            <input
              type="number"
              name="experienceTo"
              value={filters.experienceTo}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              value={filters.email}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Expertise</span>
            <input
              type="text"
              name="expertise"
              value={filters.expertise}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Languages</span>
            <input
              type="text"
              name="languages"
              value={filters.languages}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Language Proficiency</span>
            <input
              type="text"
              name="languageProficiency"
              value={filters.languageProficiency}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h2 className="text-lg font-semibold mb-4">Collaboration Rates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-gray-700">Post From</span>
                <input
                  type="number"
                  name="collaborationRates.postFrom"
                  value={filters.collaborationRates.postFrom}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Post To</span>
                <input
                  type="number"
                  name="collaborationRates.postTo"
                  value={filters.collaborationRates.postTo}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Story From</span>
                <input
                  type="number"
                  name="collaborationRates.storyFrom"
                  value={filters.collaborationRates.storyFrom}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Story To</span>
                <input
                  type="number"
                  name="collaborationRates.storyTo"
                  value={filters.collaborationRates.storyTo}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Reel From</span>
                <input
                  type="number"
                  name="collaborationRates.reelFrom"
                  value={filters.collaborationRates.reelFrom}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Reel To</span>
                <input
                  type="number"
                  name="collaborationRates.reelTo"
                  value={filters.collaborationRates.reelTo}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
            </div>
          </div>
        </div>
        <button type="submit" className="mt-6 bg-blue-600 text-white p-3 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Filter</button>
      </form>
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Filtered Writers</h2>
        <ul className="space-y-4">
          {writers.map(writer => (
            <li key={writer._id} className="p-4 border border-gray-300 rounded-lg">
              <h3 className="text-lg font-semibold">{writer.name}</h3>
              <p className="text-gray-700">Bio: {writer.bio}</p>
              <p className="text-gray-700">Experience: {writer.experience} years</p>
              <p className="text-gray-700">Email: {writer.email}</p>
              <p className="text-gray-700">Expertise: {writer.expertise}</p>
              <p className="text-gray-700">Languages: {writer.languages}</p>
              <p className="text-gray-700">Language Proficiency: {writer.languageProficiency}</p>
              <p className="text-gray-700">Collaboration Rates: Post: ${writer.collaborationRates.postFrom} - ${writer.collaborationRates.postTo}, Story: ${writer.collaborationRates.storyFrom} - ${writer.collaborationRates.storyTo}, Reel: ${writer.collaborationRates.reelFrom} - ${writer.collaborationRates.reelTo}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContentWriter;*/
