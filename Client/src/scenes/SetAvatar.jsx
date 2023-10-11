import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Loader/Loader";
import { useEffect, useState } from "react";
import { axiosInstance } from "../service/api";
import axios from "axios";
import { Buffer } from "buffer";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";


const SetAvatar = () => {
  const api = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const selected = {};
  const toastOptions = {
    position: "top-center",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === null) {
      toast.error("Please select an Avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("userInfoNew"));
      
      const response = await axiosInstance.post(`/auth/setAvatar/${user.id}`, {
        image: avatars[selectedAvatar],
      });
      // console.log(response);
      if (response.isSuccess) {
        user.isAvatarImageSet = true;
        user.avatarImage = response.data;
        localStorage.setItem("userInfoNew", JSON.stringify(user));
        navigate("/home");
      }
    }
  };

  useEffect(() => {
    const getAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };
    getAvatars();
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-center items-center flex-col gap-[3rem] h-[100vh] w-[100vw] max-md:h-[80vh]">
            <div className="mb-2">
              <h1>Pick an Avatar</h1>
            </div>
            <div className="flex max-md:flex-col max-md:gap-5 ">
              {avatars.map((avatar, index) => (
                <>
                  <div
                    key={index}
                    className={` md:rounded-full ${
                      selectedAvatar === index
                        ? " translate-y-[-5px] lg:shadow-md  scale-125"
                        : ""
                    } flex justify-center items-center transition-all p-[0.4rem] mx-5`}
                  >
                    <img
                      src={`data:image/svg+xml;base64,${avatar}`}
                      className=" lg:h-[6rem] max-md:h-[100px] max-md:w-[100px];  "
                      alt="avatar"
                      onClick={() => setSelectedAvatar(index)}
                     
                    />
                  </div>
                </>
              ))}
            </div>
            <button onClick={setProfilePicture} className="border p-3">
              Set as Profile Picture
            </button>
          </div>
          <ToastContainer />
        </>
      )}
    </>
  );
};

export default SetAvatar;
