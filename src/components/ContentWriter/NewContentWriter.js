



import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NewContentWriterTable from "./NewContentWriterTable.js";
import { useTheme } from "../../context/ThemeProvider.js";
import { UserContext } from "../../context/userContext.js";
import LocationSelector from '../OtherComponents/LocationSelector.js';


const NewContentWriter = () => {
  const { isDarkTheme } = useTheme();
  const { userData, localhosturl } = useContext(UserContext);
  const [formData, setFormData] = useState({
    userId: userData?._id,
    name: "",
    bio: "",
    email: "",

    location: {
      country: "",
      state: "",
      city: ""
    },
    wordCount: '',
    gender: 'Prefer not to say',
    experience: 0,
    expertise: [{ type: "", other: "" }],

    languages: [{ name: "", other: "", proficiency: "" }],

    collaborationRates: { post: 0, story: 0, reel: 0 },
    industry: [{ type: '', other: '', subCategories: [{ type: '', other: '' }] }],

  });

  const [addContenwriter, setAddContenwriter] = useState([])
  const [refreshKey, setRefreshKey] = useState(0);

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


  const handleAddLanguage = (newExpertise) => {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(" name, value, type, checked ", name, value, type, checked)

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

          if (value === "Other" || !updatedLanguages.some((lang, idx) => idx !== index && lang.name === value)) {
            updatedLanguages[index][key] = value;

          }
        } else {
          updatedLanguages[index][key] = value;
        }

        console.log(updatedLanguages);
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
        }
        else {
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

  const validateFormData = () => {
    const errors = [];
    formData.languages.forEach((lang, index) => {
      if (!lang.name) errors.push(`Language ${index + 1} name is required.`);
      if (!lang.proficiency) errors.push(`Language ${index + 1} proficiency is required.`);
    });

    return errors;
  };

  const createDescriptionElements = (formData, users) => {
    const elements = [
      { key: 'Name', value: formData.name },
      { key: 'Bio', value: formData.bio },
      { key: 'Email', value: formData.email },
      { key: 'Location', value: formData.location },
      { key: 'Experience', value: formData.experience },
      { key: 'Expertise', value: formData.expertise.map(exp => `${exp.type} ${exp.other ? ' (Other: ' + exp.other + ')' : ''}`).join(', ') },

      { key: 'Languages', value: formData.languages.map(lang => `${lang.name} ${lang.other ? ' (Other: ' + lang.other + ')' : ''} - Proficiency: ${lang.proficiency}`).join(', ') },
      { key: 'Collaboration Rates (Post)', value: formData.collaborationRates.post },
      { key: 'Collaboration Rates (Story)', value: formData.collaborationRates.story },
      { key: 'Collaboration Rates (Reel)', value: formData.collaborationRates.reel },

      { key: 'Industry', value: formData.industry.map(ind => `${ind.type} ${ind.other ? ' (Other: ' + ind.other + ')' : ''}${ind.subCategories.length ? ' - Subcategories: ' + ind.subCategories.map(sub => `${sub.type}${sub.other ? ' (Other: ' + sub.other + ')' : ''}`).join(', ') : ''}`).join(', ') }
    ];



    const formattedElements = elements
      .filter(element => element.value)
      .map(element => `${element.key}: ${element.value}`)
      .join(', ');
    return `${formattedElements}`;
  };
  const generateShortDescription = (formData, users) => {
    const elements = createDescriptionElements(formData, users).split(', ');


    const shortElements = elements.slice(0, 2);

    return `You created a new Content Writer with ${shortElements.join(' and ')} successfully.`;
  };

  const pastactivitiesAdd = async (users) => {
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);

    try {
      const activityData = {
        userId: userData?._id,
        action: "Created a new Content Writer",
        section: "Content Writer",
        role: userData?.role,
        timestamp: new Date(),
        details: {
          type: "create",
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
    e.preventDefault();
    console.log("Submitting form data:", formData);

    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      const response = await axios.post(
        `${localhosturl}/contentwriters/createcontentwriter`,

        { ...formData, userId: userData?._id, },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      pastactivitiesAdd(formData);
      toast.success("Content writer added successfully");
    } catch (error) {
      console.log("Error:", error.response ? error.response.data : error.message);
      toast.error(`Error adding content writer: ${error.response ? error.response.data.message : error.message}`);
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      bio: "",
      email: "",

      location: {
        country: "",
        state: "",
        city: ""
      },

      experience: 0,
      expertise: [{ type: "", other: "" }],

      languages: [{ name: "", other: "", proficiency: "" }],

      collaborationRates: { post: 0, story: 0, reel: 0 },
      industry: [{ type: '', other: '', subCategories: [{ type: '', other: '' }] }],

    });

  }


  const handleLocationSelect = (location) => {
    setFormData((prev) => ({ ...prev, location }));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl p-2 "
      >Add New Content Writer</h2>
      <form onSubmit={handleSubmit} className="mb-4 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="block">
            <label className="text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div className="block">
            <label className="text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div className="block">
            <label className="text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <LocationSelector onSelectLocation={handleLocationSelect} />


          <div className="block">
            <label className="text-gray-700">Experience</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>


          <div className="block">
            <label className="text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>


          <div className="block">
            <label className="text-gray-700">Word Count</label>
            <input
              type="number"
              name="wordCount"
              value={formData.wordCount}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
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
          </div>
          <div className="block col-span-2">
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
          </div>
          <div className="block">
            <label className="text-gray-700">Collaboration Rates (Post)</label>
            <input
              type="number"
              name="collaborationRates.post"
              value={formData.collaborationRates.post}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="block">
            <label className="text-gray-700">Collaboration Rates (Story)</label>
            <input
              type="number"
              name="collaborationRates.story"
              value={formData.collaborationRates.story}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="block">
            <label className="text-gray-700">Collaboration Rates (Reel)</label>
            <input
              type="number"
              name="collaborationRates.reel"
              value={formData.collaborationRates.reel}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="block col-span-2">
            <label className="text-xl ">Industry</label>
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
        </div>

        <div className="flex items-center justify-end space-x-2">
          <button
            type="reset"
            onClick={handleReset}
            className="py-2 px-4 bg-gray-900 text-white rounded transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105 hover:animate-resetColorChange"
          >
            Reset
          </button>
          <button disabled={!userData.permissions.contentWriter.add}
            title={!userData.permissions.contentWriter.add
              ? "You are not allowed to access this feature"
              : undefined
            }
            type="submit"
            className="py-2 px-4 bg-blue-900 text-white rounded transition duration-300 ease-in-out transform hover:scale-105 hover:animate-submitColorChange"
          >
            Submit
          </button>
        </div>
      </form>
      <NewContentWriterTable key={refreshKey} />
    </div>
  );
};

export default NewContentWriter;
