



import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NewContentWriterTable from "./NewContentWriterTable";

const NewContentWriter = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    experience: 0,
    expertise: [{ type: "", other: "" }],
    languages: [{ name: "", other: "", proficiency: "" }],
    collaborationRates: { post: 0, story: 0, reel: 0 },
    email: "",
  });
  const [addContenwriter,setAddContenwriter]=useState([])

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
      console.log("name,index, key,type,value ",name,index, key,type,value)
      setFormData((prev) => {
        const updatedLanguages = [...prev.languages];
        updatedLanguages[index][key] = value;
        console.log(updatedLanguages)
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

  const handleAddLanguage = () => {
    setFormData((prev) => ({
      ...prev,
      languages: [...prev.languages, { name: "", other: "", proficiency: "" }],
    }));
  };

  const handleRemoveLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const handleAddExpertise = () => {
    setFormData((prev) => ({
      ...prev,
      expertise: [...prev.expertise, { type: "", other: "" }],
    }));
  };

  const handleRemoveExpertise = (index) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  const validateFormData = () => {
    const errors = [];
    formData.languages.forEach((lang, index) => {
      if (!lang.name) errors.push(`Language ${index + 1} name is required.`);
      if (!lang.proficiency) errors.push(`Language ${index + 1} proficiency is required.`);
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      const response = await axios.post(
       // "http://localhost:5000/contentwriters/createcontentwriter",
        "https://guest-posting-marketplace-web-backend.onrender.com/contentwriters/createcontentwriter",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Content writer added successfully");
    } catch (error) {
      toast.error(`Error adding content writer: ${error.response ? error.response.data.message : error.message}`);
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Add New Content Writer</h1>
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
        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Submit
        </button>
      </form>
      <NewContentWriterTable addContenwriter={addContenwriter} setAddcontenwriter={setAddContenwriter} />
    </div>
  );
};

export default NewContentWriter;



/*import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const NewContentWriter = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    experience: 0,
    expertise: [""],
    languages: [{ name: "", proficiency: "" }],
    collaborationRates: { post: 0, story: 0, reel: 0 },
    email: "",
  });

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
      const index = parseInt(name.match(/\d+/)[0], 10);
      setFormData((prev) => {
        const updatedExpertise = [...prev.expertise];
        updatedExpertise[index] = value;
        return { ...prev, expertise: updatedExpertise };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));
    }
  };

  const handleLanguageChange = (index, key, value) => {
    setFormData((prev) => {
      const updatedLanguages = [...prev.languages];
      updatedLanguages[index][key] = value;
      return { ...prev, languages: updatedLanguages };
    });
  };

  const handleExpertiseChange = (index, value) => {
    setFormData((prev) => {
      const updatedExpertise = [...prev.expertise];
      updatedExpertise[index] = value;
      return { ...prev, expertise: updatedExpertise };
    });
  };

  const handleAddLanguage = () => {
    setFormData((prev) => ({
      ...prev,
      languages: [...prev.languages, { name: "", proficiency: "" }],
    }));
  };

  const handleRemoveLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const handleAddExpertise = () => {
    setFormData((prev) => ({
      ...prev,
      expertise: [...prev.expertise, ""],
    }));
  };

  const handleRemoveExpertise = (index) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  const validateFormData = () => {
    const errors = [];
   // if (!formData.bio) errors.push("Bio is required.");
    formData.languages.forEach((lang, index) => {
     if (!lang.name) errors.push(`Language ${index + 1} name is required.`);
      if (!lang.proficiency) errors.push(`Language ${index + 1} proficiency is required.`);
    });
    return errors;
   // return 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFormData();if (validationErrors.length > 0) {
     validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/contentwriters/createcontentwriter",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Content writer added successfully");
    } catch (error) {
      toast.error(`Error adding content writer: ${error.response ? error.response.data.message : error.message}`);
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Add New Content Writer</h1>
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
                  name={`expertise[${idx}]`}
                  value={exp}
                  onChange={(e) => handleExpertiseChange(idx, e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full mr-2"
                >
                  <option value="">Select Expertise</option>
                  <option value="SEO">SEO</option>
                  <option value="Content Marketing">Content Marketing</option>
                  <option value="Technical Writing">Technical Writing</option>
                  <option value="Other">Other</option>
                </select>
                {exp === "Other" && (
                  <input
                    type="text"
                    name={`expertiseOther[${idx}]`}
                    value={formData.expertiseOther?.[idx] || ""}
                    onChange={(e) => handleExpertiseChange(idx, e.target.value)}
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
                  onChange={(e) => handleLanguageChange(idx, 'name', e.target.value)}
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
                    value={lang.other || ""}
                    onChange={(e) => handleLanguageChange(idx, 'other', e.target.value)}
                    placeholder="Enter language manually"
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                )}
                <select
                  name={`languages.${idx}.proficiency`}
                  value={lang.proficiency}
                  onChange={(e) => handleLanguageChange(idx, 'proficiency', e.target.value)}
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
            <input
              type="number"
              name="collaborationRates.post"
              value={formData.collaborationRates.post}
              onChange={handleChange}
              placeholder="Post Rate"
              className="p-2 border border-gray-300 rounded w-full mb-2"
            />
            <input
              type="number"
              name="collaborationRates.story"
              value={formData.collaborationRates.story}
              onChange={handleChange}
              placeholder="Story Rate"
              className="p-2 border border-gray-300 rounded w-full mb-2"
            />
            <input
              type="number"
              name="collaborationRates.reel"
              value={formData.collaborationRates.reel}
              onChange={handleChange}
              placeholder="Reel Rate"
              className="p-2 border border-gray-300 rounded w-full mb-2"
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewContentWriter;*/









/*import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const NewContentWriter = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    experience: 0,
    expertise: [""],
    languages: [{ name: "", proficiency: "" }],
    collaborationRates: { post: 0, story: 0, reel: 0 },
    email: "",
  });

  // Update form data based on input changes
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
      const index = parseInt(name.match(/\d+/)[0], 10);
      setFormData((prev) => {
        const updatedExpertise = [...prev.expertise];
        updatedExpertise[index] = value;
        return { ...prev, expertise: updatedExpertise };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));
    }
  };

  // Validate form data before submission
  const validateFormData = () => {
    const errors = [];
    if (!formData.bio) errors.push("Bio is required.");
    formData.languages.forEach((lang, index) => {
      if (!lang.name) errors.push(`Language ${index + 1} name is required.`);
      if (!lang.proficiency) errors.push(`Language ${index + 1} proficiency is required.`);
    });
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/contentwriters/createcontentwriter",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Content writer added successfully");
    } catch (error) {
      toast.error(`Error adding content writer: ${error.response ? error.response.data.message : error.message}`);
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Add New Content Writer</h1>
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
              <input
                key={idx}
                type="text"
                name={`expertise[${idx}]`}
                value={exp}
                onChange={handleChange}
                placeholder="Expertise"
                className="p-2 border border-gray-300 rounded w-full mb-2"
              />
            ))}
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                expertise: [...prev.expertise, ""]
              }))}
              className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
            >
              Add Expertise
            </button>
          </label>
          <label className="block">
            <span className="text-gray-700">Languages</span>
            {formData.languages.map((lang, idx) => (
              <div key={idx} className="mb-2">
                <select
                  name={`languages.${idx}.name`}
                  value={lang.name}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full mb-1"
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Odia">Odia</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Other">Other</option>
                </select>
                {lang.name === "Other" && (
                  <input
                    type="text"
                    name={`languages.${idx}.name`}
                    value={lang.name}
                    onChange={handleChange}
                    placeholder="Enter language manually"
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                )}
                <select
                  name={`languages.${idx}.proficiency`}
                  value={lang.proficiency}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full"
                >
                  <option value="">Select Proficiency</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="native">Native</option>
                </select>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                languages: [...prev.languages, { name: "", proficiency: "" }]
              }))}
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewContentWriter;*/









