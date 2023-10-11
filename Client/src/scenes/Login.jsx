import { useState, useContext } from "react";
import { axiosInstance } from "../service/api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { DataContext } from "../DataProvider/DataProvider";
import './style.css'
import ButtonLoader from "../components/Loader/ButtonLoader";
const loginInitial = {
  email: "",
  password: "",
};

const registerInitial = {
  name: "",
  email: "",
  password: "",
};

const Login = ({ setIsAuth,setChange }) => {
  const [formType, setFormType] = useState("login");
  const [loginData, setLoginData] = useState(loginInitial);
  const [registerData, setRegisterData] = useState(registerInitial);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const { userDetail, setUserDetail } = useContext(DataContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    {
      formType === "login"
        ? setLoginData({ ...loginData, [e.target.name]: e.target.value })
        : setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    }
  };

  const loginUser = async (e) => {

    e.preventDefault();
    setIsLoading(true)
    try {
      const response = await axiosInstance.post("/auth/login", loginData);
      
      if (response.isSuccess) {
        setErrMsg("");
        setIsLoading(false)
        sessionStorage.setItem(
          "accessToken",
          `Bearer ${response.data.accessToken}`
        );
        sessionStorage.setItem(
          "refreshToken",
          `Bearer ${response.data.refreshToken}`
        );

        const userInfoNew = {
          name: response.data.user.name,
          email: response.data.user.email,
          id: response.data.user._id,
          isAvatarImageSet: response.data.user.isAvatarImageSet,
          avatarImage: response.data.user.avatarImage,
        };
        // Cookies.set("userInfoNew", , { expires: 1 });
        localStorage.setItem("userInfoNew",JSON.stringify(userInfoNew))
        // setUserDetail({
        //   name: response.data.user.name,
        //   email: response.data.user.email,
        //   id: response.data.user._id,
        // });
        setIsAuth(true);
        setChange(prev => !prev)
        
        if (response.data.user.isAvatarImageSet) {
          navigate("/home");
        } else {
          navigate("/setAvatar");
        }
      }
    } catch (error) {
      setErrMsg(error.msg);
      setIsLoading(false)
      setLoginData(loginInitial);
    }
  };

  const registerUser = async (e) => {
    e.preventDefault(); //very important
    setIsLoading(true)
    try {
      const response = await axiosInstance.post("/auth/register", registerData);
      if (response.isSuccess) {
        setErrMsg("");
        setIsLoading(false)
        setFormType("login");
      }
    } catch (error) {
      setErrMsg(error.msg);
      setIsLoading(false)
      setRegisterData(registerInitial);
    }
  };

  const handleFormType = () => {
    {
      formType === "login"
        ? (() => {
            setFormType("register");
            setErrMsg("");
          })()
        : (() => {
            setFormType("login");
            setErrMsg("");
          })();
    }
  };
  return (
    <>
      {formType === "login" ? (
        // login
        <div className="min-h-screen flex items-center justify-center bg-white-400 bg ">
          <div className=" p-8 rounded-lg  lg:w-96 border-[1px] border-white border-opacity-25 max-lg:w-[80%]  login-card">
            <h2 className="text-2xl font-semibold mb-8 text-center text-white">Login</h2>
            <div className=" min-h-[30px] text-red-400 mb-3 text-center">
              {errMsg ? errMsg : ""}
            </div>
            <form onSubmit={(e) => loginUser(e)}>
              <div className="mb-4 text-white">
                {/* <label htmlFor="email" className="block text-white">
                  Email:
                </label> */}
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  className="w-full  border-[1px] border-white border-opacity-25 p-2 rounded focus:outline-none bg-transparent text-white placeholder:text-white"
                  onChange={(e) => handleChange(e)}
                  autoComplete="on"
                  placeholder=" Email "
                />
              </div>
              <div className="mb-4 mt-10">
                {/* <label htmlFor="password" className="block text-white">
                  Password:
                </label> */}
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  className="w-full text-white border-[1px] border-white border-opacity-25 p-2 rounded bg-transparent  focus:outline-none placeholder:text-white"
                  onChange={(e) => handleChange(e)}
                  autoComplete="true"
                  placeholder=" Password"
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className=" bg-transparent mt-5 text-white px-4 py-2 rounded border-[1px] border-white border-opacity-25 hover:border-white transition hover:shadow-md"
                >
                  {isLoading ? <ButtonLoader/> : 'Login'}
                </button>
              </div>
            </form>
            <p className="text-center mt-4 text-white">
              Don't have an account?{" "}
              <button
                onClick={handleFormType}
                className="text-gray-800 border-b-[1px] border-white border-opacity-25 mt-3"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      ) : (
        // register
        <div className="min-h-screen flex items-center justify-center bg-white-400 bg">
          <div className="bg-white-200 p-8 rounded-lg  lg:w-96 login-card">
            <h2 className="text-2xl font-semibold mb-8 text-center text-white">
              Register
            </h2>
            <div className=" min-h-[30px] text-red-400 text-center mb-3">
              {errMsg ? errMsg : ""}
            </div>
            <form method="post" onSubmit={(e) => registerUser(e)}>
              <div className="mb-4 text-white">
                {/* <label htmlFor="name" className="block text-gray-600">
                  Name:
                </label> */}
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={registerData.name}
                  className="w-full focus:outline-none text-white border-[1px] border-white border-opacity-25  bg-transparent  p-2 rounded mb-3 placeholder:text-white"
                  onChange={(e) => handleChange(e)}
                  autoComplete="on"
                  placeholder=" Name "
                />
              </div>
              <div className="mb-4">
                {/* <label htmlFor="email" className="block text-gray-600">
                  Email:
                </label> */}
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={registerData.email}
                  className="w-full focus:outline-none text-white border-[1px] border-white border-opacity-25 bg-transparent  p-2 rounded mb-3 placeholder:text-white"
                  onChange={(e) => handleChange(e)}
                  autoComplete="on"
                  placeholder=" Email "
                />
              </div>
              <div className="mb-4">
                {/* <label htmlFor="password" className="block text-gray-600">
                  Password:
                </label> */}
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={registerData.password}
                  className="w-full border-[1px] focus:outline-none text-white border-white border-opacity-25  bg-transparent  p-2 rounded mb-3 placeholder:text-white"
                  onChange={(e) => handleChange(e)}
                  autoComplete="on"
                  placeholder=" Password "
                />
              </div>
              <div className="text-center ">
                <button
                  type="submit"
                  className="bg-transparent mt-5 text-white px-4 py-2 rounded border-[1px] border-white border-opacity-25 hover:border-white hover:shadow-md transition"
                >
                  {isLoading ? <ButtonLoader/> : "Register"}
                </button>
              </div>
            </form>
            <p className="text-center mt-4 text-white">
              Already have an account?{" "}
              <button
                onClick={handleFormType}
                className="text-gray-800 border-b-[1px] border-white border-opacity-25 mt-3"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
