import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Link, Navigate, useNavigate } from "react-router-dom";

const FormTable = ({ users }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [filters, setFilters] = useState({
    mozDA: "",
    ahrefsDR: "",
    mozSpamScore: "",
    price: "",
    monthlyTraffic: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [stripePromise, setStripePromise] = useState(null);

  // Initialize Stripe promise once
  if (!stripePromise) {
    setStripePromise(loadStripe("YOUR_PUBLISHABLE_KEY"));
  }

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const sortedUsers = React.useMemo(() => {
    let sortedData = [...users];

    // Filter data based on filters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        sortedData = sortedData.filter(
          (user) => user[key].toLowerCase() === filters[key].toLowerCase()
        );
      }
    });

    // Sort data based on sortConfig
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedData;
  }, [users, sortConfig, filters]);

  const filteredUsers = sortedUsers.filter((user) =>
    user.categories.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuyNow = async (userId, price) =>{
    navigate("/checkout");
  }

  /*const handleBuyNow = async (userId) => {
    const stripe = await stripePromise;

    // Create a PaymentIntent on your backend
    const response = await fetch("http://localhost:5000/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        amount: 1000, // Replace with actual amount calculation
      }),
    });

    const { clientSecret } = await response.json();

    // Confirm the PaymentIntent using Stripe.js and Elements
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: stripe.elements.getElement("card"),
        billing_details: {
          name: "Customer Name",
        },
      },
    });

    if (result.error) {
      console.error("Payment failed:", result.error.message);
      // Handle payment failure (e.g., show error message to user)
    } else {
      console.log("Payment succeeded:", result.paymentIntent);
      // Handle successful payment (e.g., update UI, redirect user)
    }
  };*/

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Categories"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4 w-64"
          />
          <div className="absolute right-3 top-2">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
      </div>
      <div className="table-container">
        <p>Found: {filteredUsers.length}</p>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200">
                Moz DA
                <select
                  onChange={(e) => handleSortChange("mozDA", e.target.value)}
                  className="ml-2"
                >
                  <option value="">Sort</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>
              </th>
              <th className="py-2 px-4 border-b border-gray-200">
                Ahrefs DR
                <select
                  onChange={(e) => handleSortChange("ahrefsDR", e.target.value)}
                  className="ml-2"
                >
                  <option value="">Sort</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>
              </th>
              <th className="py-2 px-4 border-b border-gray-200">
                Moz Spam Score
                <select
                  onChange={(e) =>
                    handleSortChange("mozSpamScore", e.target.value)
                  }
                  className="ml-2 bg-gray-200 p-1 rounded"
                >
                  <option value="">Sort</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>
              </th>
              <th className="py-2 px-4 border-b border-gray-200">
                Price
                <select
                  onChange={(e) => handleSortChange("price", e.target.value)}
                  className="ml-2"
                >
                  <option value="">Sort</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>
              </th>
              <th className="py-2 px-4 border-b border-gray-200">
                Monthly Traffic
                <select
                  onChange={(e) =>
                    handleSortChange("monthlyTraffic", e.target.value)
                  }
                  className="ml-2"
                >
                  <option value="">Sort</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>
              </th>
              <th className="py-2 px-4 border-b border-gray-200">Actions</th>
              {/*<th className="py-2 px-4 border-b border-gray-200">Other Columns</th>*/}
            </tr>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-2 md:px-6 text-left">S.No.</th>
              <th className="py-3 px-2 md:px-6 text-left">Categories</th>
              <th className="py-3 px-2 md:px-6 text-left">ahrefDR</th>
              <th className="py-3 px-2 md:px-6 text-left">mozDA</th>
              <th className="py-3 px-2 md:px-6 text-left">Website Language</th>
              <th className="py-3 px-2 md:px-6 text-left">Link Type</th>
              <th className="py-3 px-2 md:px-6 text-left">Price</th>
              <th className="py-3 px-2 md:px-6 text-left">mozSpamScore</th>
              <th className="py-3 px-2 md:px-6 text-left">Monthly Traffic</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="py-3 px-6 text-center text-lg font-semibold"
                >
                  No Data Fetched
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-2 md:px-6 text-center text-md font-semibold">
                    {index + 1}
                  </td>
                  <td className="py-3 px-2 md:px-6 text-center text-md font-semibold">
                    {user.categories}
                  </td>
                  <td className="py-3 px-2 md:px-6 text-center text-md font-semibold">
                    {user.ahrefsDR}
                  </td>
                  <td className="py-3 px-2 md:px-6 text-center text-md font-semibold">
                    {user.mozDA}
                  </td>
                  <td className="py-3 px-2 md:px-6 text-center text-md font-semibold">
                    {user.websiteLanguage}
                  </td>
                  <td className="py-3 px-2 md:px-6 text-center text-md font-semibold">
                    {user.linkType}
                  </td>
                  <td className="py-3 px-2 md:px-6 text-center text-md font-semibold">
                    {user.price}
                  </td>
                  <td className="py-3 px-2 md:px-6 text-center text-md font-semibold">
                    {user.mozSpamScore}
                  </td>
                  <td className="py-3 px-2 md:px-6 text-center text-md font-semibold">
                    {user.monthlyTraffic}
                  </td>
                  <td className="py-3 px-2 md:px-6 text-center text-md font-semibold">
                    <button
                      onClick={() => handleBuyNow(user._id, user.price)}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
                    >
                      Buy Now (${user.price})
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormTable;
