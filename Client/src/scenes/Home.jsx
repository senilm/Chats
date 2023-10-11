import { useContext, useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Contacts from "../components/HomeComponents/Contacts";
import DisplayConvo from "../components/HomeComponents/DisplayConvo";
import MessageForm from "../components/HomeComponents/MessageForm";
import { axiosInstance } from "../service/api";
import Welcome from "../components/HomeComponents/Welcome";
import {io} from 'socket.io-client'
import './style.css'
const Home = ({change,toggleDark,theme}) => {
  
  const socket = useRef()
  const [contacts, setContacts] = useState([])
  const [currentUserInfo, setCurrentUserInfo] = useState({})
  const [currentChat, setCurrentChat] = useState(undefined)
  const [isLoaded, setIsLoaded] = useState(false)
  const [chatSelected, setChatSelected] = useState(false)
  const navigate = useNavigate()

  useEffect( ()=>{
    let getCurrentUserInfo = async()=>{
      try {
        const userInfo = await JSON.parse(localStorage.getItem("userInfoNew"));
        setCurrentUserInfo(userInfo)
        setIsLoaded(true)
        const response = await axiosInstance.get(`/auth/allUsers/${userInfo.id}`);
        
        setContacts(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
    getCurrentUserInfo()
  },[change])

  useEffect(()=>{
    if(currentUserInfo){
      socket.current = io('http://localhost:3001')
      socket.current.emit("add-user",currentUserInfo?.id)
    }
  },[currentUserInfo])

  
const handleChatChange = (chat) =>{
  setCurrentChat(chat);
  setChatSelected(true)
}

const goBackToChat = () =>{
  setChatSelected(false)
}
const logout = () =>{
  localStorage.clear();
  sessionStorage.clear();
  navigate('/login')
}
  return (
    <>
      <section className={`${theme === 'light'? 'bg': 'dark-bg' } flex h-[100vh] w-[100vw] flex-col justify-center gap-4 items-center `}>
        <div className={` ${theme === 'light'? 'card': 'dark-card' } shadow-lg h-[85vh] w-[85vw] flex max-lg:h-[100vh] max-lg:w-[100vw]  `}>
          <div className={`  min-w-[30%] max-sm:min-w-[100%]  ${chatSelected ? " max-sm:hidden" : ""}`}>
            <Contacts contacts={contacts} currentUserInfo={currentUserInfo} handleChatChange={handleChatChange} logout={logout} toggleDark={toggleDark}/>
          </div>
          <div className={` min-w-[70%] flex-1 ${chatSelected ? "max-lg:min-w-[100%]" : " max-lg:hidden"}`}>
            {isLoaded && currentChat === undefined ? 
            <Welcome currentUserInfo={currentUserInfo}/>
            :
            <DisplayConvo currentChat={currentChat} goBackToChat={goBackToChat} currentUserInfo={currentUserInfo} socket={socket}/>
          }
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
// bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1124&q=100')] bg-center bg-no-repeat bg-cover