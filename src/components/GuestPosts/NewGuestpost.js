import { useContext, useState } from "react";
import axios from "axios";
import NewGuestpostTable from "./NewGuestpostTable.js";
import { toast } from "react-toastify";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../../context/userContext.js";
import { useTheme } from "../../context/ThemeProvider.js";

/*import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaChartBar } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
*/

const NewGuestpost = () => {
    const { isDarkTheme } = useTheme();
    const { userData, localhosturl } = useContext(UserContext);
    const userId = userData?._id;
    console.log(userData, userId)
    const initialFormData = {
        publisherURL: "",
        publisherName: "",
        publisherEmail: "",
        publisherPhoneNo: "",
        mozDA: "1",
        categories: "Agriculture",
        websiteLanguage: "English",
        ahrefsDR: "1",
        linkType: "Do Follow",
        price: "1",
        monthlyTraffic: "Monthly Traffic >= 1000",
        mozSpamScore: "Spam Score <= 01",
        userId:userData?._id,
        // siteWorkedWith: "",
        // publisherRole: "",
    };

    const [formDatas, setFormData] = useState(initialFormData);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value === "0" ? "" : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            await axios.post(`${localhosturl}/admin/createAdminData`,

                formDatas
            );
            toast.success("Successfully Created");
            setFormData(initialFormData);
            setRefreshKey((prevKey) => prevKey + 1);
        } catch (error) {
            toast.error(error.message);
            console.error("Error submitting form:", error);
        }
    };

    /* const barData = {
       labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
       datasets: [
         {
           label: 'Monthly Users',
           data: [65, 59, 80, 81, 56, 55, 40],
           backgroundColor: 'rgba(75, 192, 192, 0.6)',
         },
       ],
     };
   
     const lineData = {
       labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
       datasets: [
         {
           label: 'Monthly Revenue',
           data: [300, 500, 400, 600, 700, 500, 600],
           fill: false,
           borderColor: 'rgba(75, 192, 192, 1)',
         },
       ],
     };
   
     const barOptions = {
       responsive: true,
       plugins: {
         legend: {
           position: 'top',
         },
         title: {
           display: true,
           text: 'Monthly Users',
         },
       },
     };
   
     const lineOptions = {
       responsive: true,
       plugins: {
         legend: {
           position: 'top',
         },
         title: {
           display: true,
           text: 'Monthly Revenue',
         },
       },
     };*/

    return (
        <div className="p-4">
            <h2 className="text-xl  mb-3  p-3"//text-white bg-blue-700 font-bold
            >
                Guestpost Page
            </h2>
            {/*<section className="mb-6">
        <h2 className="text-xl font-bold mb-3 flex items-center">
          <FontAwesomeIcon icon={FaChartBar} className="mr-2" />
          Overview
        </h2>
        <div className="bg-gray-200 p-4 shadow-xl">
          <p>Summary statistics and analytics of platform usage.</p>
          <div className="my-4">
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="my-4">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </section>*/}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 md:space-y-8 bg-gray-200 shadow-xl p-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="publisherName" className="font-medium">
                            Publisher Name
                        </label>
                        <input
                            type="text"
                            id="publisherName"
                            name="publisherName"
                            required
                            value={formDatas.publisherName}
                            onChange={handleChange}
                            className="form-input border rounded p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="publisherEmail" className="font-medium">
                            Publisher Email
                        </label>
                        <input
                            type="email"
                            id="publisherEmail"
                            name="publisherEmail"
                            required
                            value={formDatas.publisherEmail}
                            onChange={handleChange}
                            className="form-input border rounded p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="publisherPhoneNo" className="font-medium">
                            Publisher Phone No.
                        </label>
                        <input
                            type="tel"
                            id="publisherPhoneNo"
                            name="publisherPhoneNo"
                            pattern="[0-9]{10}"
                            title="Please enter a 10-digit phone number"
                            required
                            value={formDatas.publisherPhoneNo}
                            onChange={handleChange}
                            className="form-input border rounded p-2"
                        />
                    </div>
                </div>

                {/* 1st Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="publisherURL" className="font-medium">
                            Publisher URL
                        </label>
                        <input
                            type="url"
                            id="publisherURL"
                            name="publisherURL"
                            title="Please ensure to provide proper format of the url"
                            required
                            pattern="https?://.*"
                            placeholder="https://www.google.com"
                            value={formDatas.publisherURL}
                            onChange={handleChange}
                            className="form-input border rounded p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="mozDA" className="font-medium">
                            Moz DA
                        </label>
                        <input
                            type="number"
                            id="mozDA"
                            name="mozDA"
                            min="1"
                            max="100"
                            placeholder="1"
                            required
                            value={formDatas.mozDA}
                            onChange={handleChange}
                            className="form-input border rounded p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="categories" className="font-medium">
                            Categories
                        </label>
                        <select
                            id="categories"
                            name="categories"
                            required
                            value={formDatas.categories}
                            onChange={handleChange}
                            className="form-input border rounded p-2"
                        >
                            {/* Options */}
                            <option value="Agriculture">Agriculture</option>
                            <option value="Animals and Pets">Animals and Pets</option>
                            <option value="Art">Art</option>
                            <option value="Automobiles">Automobiles</option>
                            <option value="Business">Business</option>
                            <option value="Books">Books</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Career and Employment">
                                Career and Employment
                            </option>
                            <option value="Computer">Computer</option>
                            <option value="Construction and Repairs">
                                Construction and Repairs
                            </option>
                            <option value="Culture">Culture</option>
                            <option value="Ecommerce">E-commerce</option>
                            <option value="Education">Education</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Environment">Environment</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Finance">Finance</option>
                            <option value="Web Development">Web Development</option>
                            <option value="App Development">App Development</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="websiteLanguage" className="font-medium">
                            Website Language
                        </label>
                        <select
                            id="websiteLanguage"
                            name="websiteLanguage"
                            required
                            value={formDatas.websiteLanguage}
                            onChange={handleChange}
                            className="form-input border rounded p-2"
                        >
                            {/* Options */}
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
                        </select>
                    </div>

                </div>

                {/* 2nd Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="ahrefsDR" className="font-medium">
                            Ahrefs DR
                        </label>
                        <input
                            type="number"
                            id="ahrefsDR"
                            name="ahrefsDR"
                            placeholder="1"
                            min="1"
                            max="100"
                            required
                            value={formDatas.ahrefsDR}
                            onChange={handleChange}
                            className="form-input border rounded p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="linkType" className="font-medium">
                            Link Type
                        </label>
                        <select
                            id="linkType"
                            name="linkType"
                            required
                            value={formDatas.linkType}
                            onChange={handleChange}
                            className="form-input border rounded p-2"
                        >
                            <option value="Do Follow">Do Follow</option>
                            <option value="No Follow">No Follow</option>
                        </select>
                    </div>
                </div>

                {/* 3rd Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="price" className="font-medium">
                            Price
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                        <span className="p-2 text-xl">₹</span>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            min="1"
                            max="100000"
                            required
                            placeholder="1"
                            value={formDatas.price}
                            onChange={handleChange}
                            className="form-input border rounded p-2"
                        />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="monthlyTraffic" className="font-medium">
                            Monthly Traffic
                        </label>
                        <select
                            id="monthlyTraffic"
                            name="monthlyTraffic"
                            required
                            value={formDatas.monthlyTraffic}
                            onChange={handleChange}
                            className="form-input border rounded p-2"
                        >
                            {/* Options */}
                            <option value="Monthly Traffic >= 1000">
                                Monthly Traffic {">="} 1000
                            </option>
                            <option value="Monthly Traffic >= 10000">
                                Monthly Traffic {">="} 10,000
                            </option>
                            <option value="Monthly Traffic >= 50000">
                                Monthly Traffic {">="} 50,000
                            </option>
                            <option value="Monthly Traffic >= 100000">
                                Monthly Traffic {">="} 100,000
                            </option>
                            <option value="Monthly Traffic >= 200000">
                                Monthly Traffic {">="} 200,000
                            </option>
                            <option value="Monthly Traffic >= 300000">
                                Monthly Traffic {">="} 300,000
                            </option>
                            <option value="Monthly Traffic >= 400000">
                                Monthly Traffic {">="} 400,000
                            </option>
                            <option value="Monthly Traffic >= 500000">
                                Monthly Traffic {">="} 500,000
                            </option>
                            <option value="Monthly Traffic >= 600000">
                                Monthly Traffic {">="} 600,000
                            </option>
                            <option value="Monthly Traffic >= 700000">
                                Monthly Traffic {">="} 700,000
                            </option>
                            <option value="Monthly Traffic >= 800000">
                                Monthly Traffic {">="} 800,000
                            </option>
                            <option value="Monthly Traffic >= 900000">
                                Monthly Traffic {">="} 900,000
                            </option>
                            <option value="Monthly Traffic >= 1000000">
                                Monthly Traffic {">="} 1,000,000
                            </option>
                            <option value="Monthly Traffic >= 10000000">
                                Monthly Traffic {">="} 10,000,000
                            </option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="mozSpamScore" className="font-medium">
                            Moz Spam Score
                        </label>
                        <select
                            id="mozSpamScore"
                            name="mozSpamScore"
                            required
                            value={formDatas.mozSpamScore}
                            onChange={handleChange}
                            className="form-input border rounded p-2"
                        >
                            {/* Options */}
                            <option value="Spam Score <= 01">Spam Score {"<="} 01</option>
                            <option value="Spam Score <= 02">Spam Score {"<="} 02</option>
                            <option value="Spam Score <= 05">Spam Score {"<="} 05</option>
                            <option value="Spam Score <= 10">Spam Score {"<="} 10</option>
                            <option value="Spam Score <= 20">Spam Score {"<="} 20</option>
                            <option value="Spam Score <= 30">Spam Score {"<="} 30</option>
                        </select>
                    </div>
                </div>

                {/* 4th Row */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="siteWorkedWith" className="font-medium">
              Sites {"I've (haven't)"} Worked With
            </label>
            <select
              id="siteWorkedWith"
              name="siteWorkedWith"
              value={formDatas.siteWorkedWith}
              onChange={handleChange}
              className="form-input border rounded p-2"
            >
              <option value="allWebsitesWorkedWith">All Websites</option>
              <option value="excludeSitesWorkedWith">
                Exclude Sites {"I've"} Worked With
              </option>
              <option value="onlySitesWorkedWith">
                Only Sites {"I've"} Worked With
              </option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="publisherRole" className="font-medium">
              Publisher Role
            </label>
            <select
              id="publisherRole"
              name="publisherRole"
              value={formDatas.publisherRole}
              onChange={handleChange}
              className="form-input border rounded p-2"
            >
              <option value="allWebsitesRole">All Websites</option>
              <option value="websitesByOwner">Websites added by Owner</option>
              <option value="websitesByContributors">
                Websites added by Contributors
              </option>
            </select>
          </div>
        </div> */}


                <div className="flex items-center justify-end space-x-2">
                    {/* <button
            type="button"
            onClick={handleSaveSearch}
            className="py-2 px-4 bg-green-600 text-white rounded transition duration-300 ease-in-out transform hover:bg-green-500 hover:scale-105"
          >
            Save Search
          </button>*/}

                    <button
                        type="reset"
                        onClick={() => setFormData(initialFormData)}
                        className="py-2 px-4 bg-gray-900 text-white rounded transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105 hover:animate-resetColorChange"
                    >
                        Reset
                    </button>
                    <button
                    disabled={!userData.permissions.guestPost.add} 
                    title={!userData.permissions.guestPost.add
                       ? "You are not allowed to access this feature"
                     :undefined  // : ""
                    }
                        type="submit"
                        className="py-2 px-4 bg-blue-900 text-white rounded transition duration-300 ease-in-out transform hover:scale-105 hover:animate-submitColorChange"
                    >
                        Submit
                    </button>
                </div>


            </form>
            <h2 className="text-xl   p-2 my-2"// text-white bg-blue-700 
            >
                Guestpost List
            </h2>
            <NewGuestpostTable key={refreshKey} />
        </div>
    );
};

export default NewGuestpost;