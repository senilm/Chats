import MessageForm from "./MessageForm";
import Messages from "./Messages";
import { axiosInstance } from "../../service/api";
import {v4 as uuidv4} from 'uuid'
import { getAuthorized } from "../../service/api";
import { useEffect, useRef, useState } from "react";
import './Contact.css'
import { useNavigate } from "react-router-dom";

const DisplayConvo = ({ currentChat, currentUserInfo, socket,goBackToChat }) => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  const handleSendMsg = async (msg) => {
    const response = await axiosInstance.post(
      "/message/addMsg",
      {
        from: currentUserInfo.id,
        to: currentChat._id,
        message: msg,
      },
      {
        headers: {
          Authorization: getAuthorized(),
        },
      }
    );
    if (response.isSuccess) {
      setValue(!value);
      
    }
    socket.current.emit("send-msg",{
      to:currentChat?._id,
      from:currentUserInfo?.id,
      message: msg
    })

    const msgs = [...messages]
    msgs.push({fromSelf:true,message:msg})
    setMessages(msgs);
  };

  useEffect(()=>{
    if(socket.current){
      socket.current.on("msg-receive",(msg)=>{
        setArrivalMessage({fromSelf:false,message:msg})
      })
    }
  },[])

  useEffect(()=>{
    arrivalMessage && setMessages((prev) => [...prev,arrivalMessage])
  },[arrivalMessage])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentChat]);

  

  useEffect(() => {
    const getMsg = async () => {
      if(currentChat){

        const response = await axiosInstance.post(
          "/message/getMsg",
          {
            from: currentUserInfo?.id,
            to: currentChat?._id,
          },
          {
            headers: {
              Authorization: getAuthorized(),
            },
          }
          );
          if (response.isSuccess) {
            setMessages(response.data);
          }
        };
      }
    getMsg();
  }, [currentChat, value]);
  return (<div className="flex flex-col justify-between md:items-center md:min-h-[85vh] md:max-h-[85vh]" key={uuidv4()}>
      <div
        id="chat-header"
        className="flex justify-center md:mt-3 items-center max-sm:justify-start max-sm:pt-3  px-12 "
      >
        <button onClick={goBackToChat} className="max-sm:ml-[-25px] sm:hidden max-sm:mr-5 mb-3 text-white"><i class="fa-solid fa-arrow-left"></i></button>
        <div id="user-detail" className=" flex items-center gap-2 ml-3 mb-3">
          <div id="avatar">
            <img
              src={`data:image/svg+xml; base64,${currentChat?.avatarImage}`}
              alt="Avatar"
              className=" h-12 "
            />
          </div>
          <div id="username" className=" text-2xl text-white ">
            {currentChat?.name.toUpperCase()}
          </div>
        </div>
      </div>
      <div
        id="chat-messages"
        className="flex-1 flex flex-col gap-4 mb-5 mt-5 w-full px-10 max-md:px-5 py-4 max-h-[55vh] max-md:min-h-[76vh] max-sm:flex-1 overflow-y-auto custom-scrollbar"
        ref={scrollRef} 
      >
        {messages.map((msg) => {
          return (
            <div
              key={msg.id}
              className={`flex ${
                msg.fromSelf ? " justify-end " : " justify-start"
              }`}
            >
              <div id="message"></div>
              <div
                id="content"
                className={`${
                  msg.fromSelf ? " bg-transparent  text-white  " : " bg-transparent text-gray-200"
                } max-w-[50%] break-all p-4 max-md:py-2 max-md:px-3 text-[1rem] border-white border border-opacity-25 rounded-xl`}
              >
                <p>{msg.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div id="chat-input" className="mb-10 w-full px-10">
        <MessageForm handleSendMsg={handleSendMsg} />
      </div>
    </div>
  );
};

export default DisplayConvo;
