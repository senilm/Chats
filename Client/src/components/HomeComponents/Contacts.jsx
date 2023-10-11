import { useEffect, useState } from "react";
import { axiosInstance, getAuthorized } from "../../service/api";
import "./Contact.css";
import Cookies from "js-cookie";
const Contacts = ({ contacts, currentUserInfo, handleChatChange, logout,toggleDark }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [darkModeButtonText, setDarkModeButtonText] = useState(<i className="fa-solid fa-moon"></i>);
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    if (currentUserInfo) {
      setCurrentUserImage(currentUserInfo.avatarImage);
      setCurrentUserName(currentUserInfo.name);
    }
  }, [currentUserInfo]);

  const getUser =async  (e) =>{
    e.preventDefault()
    const response = await axiosInstance.get(`/auth/searchUser/${searchName}`,{
      headers:{
        Authorization:getAuthorized()
      }
    })
    console.log(response);

  }

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    handleChatChange(contact);
  };

  const handleSelectChange = (e) =>{
    const selectedVal = e.target.value;
    if (selectedVal === 'logout') {
      logout()
    }
  }

  

  const handleDark = () =>{
    toggleDark()
      setDarkMode(!darkMode); 
      setDarkModeButtonText(darkMode ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>);
  }
  return (
    currentUserImage &&
    currentUserName && (
      <div className="flex  flex-col w-full overflow-hidden">
        <div className="flex w-full justify-between px-5  h-20 items-center mb-2 gap-3 ">
          <div>
            <img
              src={`data:image/svg+xml; base64,${currentUserImage}`}
              alt="Avatar"
              className=" h-10"
            />
          </div>
          
          <div className="">
          <button onClick={handleDark} className="mr-2 text-white">{darkModeButtonText}</button>
            <select className="bg-transparent   border-white border border-opacity-25  rounded-lg p-1 text-white" onChange={(e)=>handleSelectChange(e)}>
              <option value={currentUserName.toUpperCase()} className=" text-black bg-blue-200  rounded-lg">
                {currentUserName.toUpperCase()}
              </option>
              <option value="logout" className=" bg-blue-200 text-black rounded-lg">Log Out</option>
            </select>
          </div>
        </div>
        <div className=" flex flex-col items-center h-[60vh] border-1 border-black gap-3 overflow-y-auto custom-scrollbar">
          {contacts.map((contact, index) => (
            <div
              key={contact._id}
              className={`${
                index === currentSelected ? "border-b" : ""
              } cursor-pointer w-[90%] flex hover:scale-110  items-center max-sm:border-b  border-white border-opacity-25 p-3 h-16 transition-all`}
              onClick={() => changeCurrentChat(index, contact)}
            >
              <div>
                <img
                  src={`data:image/svg+xml; base64,${contact.avatarImage}`}
                  alt="Avatar"
                  className=" h-12 pb-2"
                />
              </div>
              <div>
                <h3 className="text-white ml-3 mb-1 pb-2">
                  {contact.name.toUpperCase()}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Contacts;
