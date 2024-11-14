
import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext.js";
import { toast } from "react-toastify";
import Layout from "../../Layout/Layout.js";
import { useTheme } from "../../context/ThemeProvider.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Login() {
  const { isDarkTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserData,localhosturl } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${localhosturl}/user/login`, { email, password })
     
      .then((response) => {
        const user = response.data.user;

       if (!user.isVerified) {
          toast.error("Please verify your email to log in.");
          return;
        }
        toast.success("Logged in successfully");
        console.log("response.data.user Login ",response.data.user);
        setUserData(response.data.user);
        //navigate("/form");
        navigate("/guestpost")
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        console.log(error);
      });
  };

  return (
    <Layout isRegisterPage={false}>
      <div className="w-full max-w-md mx-auto p-8 rounded-lg shadow-2xl space-y-8"// bg-gray-100 
      >
        <div>
          <h2 className="mt-6 text-center text-3xl "//font-extrabold text-gray-900
          >
            Log in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
             <div className="relative">
             <input
                id="password"
                name="password"
               // type="password"
               type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border  ${isDarkTheme ? "border-gray-600 text-gray-100" : "border-gray-300 text-gray-900"} placeholder-gray-500  focus:outline-none focus:border-indigo-500 sm:text-sm`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
                <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
             </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>
          </div>
          <div className="flex justify-around">
            <span>Don't have an account?</span>
            <Link
              to="/signup"
              className="group relative flex justify-center py-1 px-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
