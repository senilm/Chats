import EmojiPicker from 'emoji-picker-react';
import { useState } from "react";

const MessageForm = ({handleSendMsg}) => {

  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [msg, setMsg] = useState("")

  const handleEmojiPickerHideShow = () =>{
    setShowEmojiPicker(!showEmojiPicker)
    
  }

  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    setMsg(prevMsg => prevMsg + emoji); 
  }

  const sendChat = (e) =>{
    e.preventDefault();
    if (msg.length>0) {
      handleSendMsg(msg);
      setMsg("")
    }
  }
  return (
    <div className="flex items-center  w-full  gap-5">
      <div id="emoji" className="flex gap-4 items-center w-full">
        <div  className='relative'>
          <div onClick={handleEmojiPickerHideShow} className=' cursor-pointer text-yellow-400 '><i class="fa-solid fa-face-smile fa-2xl"></i></div>
          <div className=' absolute top-[-320px] left-[-12px]'>
          {showEmojiPicker ? <EmojiPicker onEmojiClick={handleEmojiClick} height={300} width={300} emojiStyle='twitter'  /> : null} 
          </div>
        </div>
        <form className="flex gap-5 w-full flex-1" onSubmit={(e)=>sendChat(e)}>
          <input
            type="text"
            className=" focus:outline-none p-4  w-full rounded-full border-white border bg-transparent border-opacity-25 text-white "
            placeholder="Write message here"
            autoCorrect="on"
            value={msg}
            onChange={(e)=>setMsg(e.target.value)}
          />
          <button type="submit" className=" active:scale-90 bg-transparent lg:border-[1px] border-white border-opacity-25 text-white w-24  lg:p-4 rounded-full ">
          <i class="fa-solid fa-arrow-right"></i>
          </button>
        </form>
      </div>
   
    </div>
  );
};

export default MessageForm;
