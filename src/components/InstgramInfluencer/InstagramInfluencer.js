import axios from "axios";
import { useContext, useState } from "react";
import InstagramInfluencerTable from "./InstagramInfluencerTable";
import { toast } from "react-toastify";
import { UserContext } from "../../context/userContext";
import SaveSearch from "../OtherComponents/SaveSearch";
import LocationSelector from "../OtherComponents/LocationSelector";

const InstagramInfluencer = () => {
  const { userData, localhosturl } = useContext(UserContext);
  const userId = userData?._id;

  const initialFormData = {
    username: "",
    fullName: "",
    followersCountFrom: "",
    followersCountTo: "",
    engagementRateFrom: "",
    engagementRateTo: "",
    category: "",
    location: { country: "", state: "", city: "" },
    language: "",
    verifiedStatus: "",
    collaborationRates: {
      postFrom: "",
      postTo: "",
      storyFrom: "",
      storyTo: "",
      reelFrom: "",
      reelTo: "",
    },
    userId,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [influencers, setInfluencers] = useState([]);
  const [locationQuery, setLocationQuery] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameArray = name.split(".");

    if (nameArray.length === 1) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [nameArray[0]]: {
          ...prev[nameArray[0]],
          [nameArray[1]]: value,
        },
      }));
    }
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        country: location.country || prev.location.country,
        state: location.state || prev.location.state,
        city: location.city || prev.location.city,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = {
        ...formData,
        userId,
        verifiedStatus:
          formData.verifiedStatus === ""
            ? ""
            : formData.verifiedStatus === "verified",
      };

      const response = await axios.post(
        `${localhosturl}/userbrand/filter`,
        formDataToSend
      );

      setInfluencers(response.data);
      logPastActivity(response.data);
      toast.success("Data fetched successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data.");
    }
  };

  const logPastActivity = async (results) => {
    const description = [
      formData.username && `Username: ${formData.username}`,
      formData.fullName && `Fullname: ${formData.fullName}`,
      formData.followersCountFrom &&
        `Followers Count: ${formData.followersCountFrom} - ${formData.followersCountTo}`,
      formData.engagementRateFrom &&
        `Engagement Rate: ${formData.engagementRateFrom} - ${formData.engagementRateTo}`,
      formData.category && `Category: ${formData.category}`,
      `Results: ${results.length}`,
    ]
      .filter(Boolean)
      .join(", ");

    try {
      await axios.post(`${localhosturl}/pastactivities/createPastActivities`, {
        userId,
        action: "Performed a search for Instagram Influencers",
        section: "Instagram Influencer",
        timestamp: new Date(),
        details: { description, filter: formData },
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto overflow-x-auto">
      <h3 className="text-2xl p-2 my-2">Instagram Influencer Search</h3>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 shadow-xl p-4 relative"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex flex-col">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          {/* Add other input fields similarly */}
          <LocationSelector onSelectLocation={handleLocationSelect} />
        </div>
        <div className="mt-4 flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </form>
      <InstagramInfluencerTable data={influencers} />
    </div>
  );
};

export default InstagramInfluencer;
