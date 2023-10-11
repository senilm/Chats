import { useNavigate } from "react-router-dom";
import './style.css'
const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <section
        id="home"
        className="p-2 flex justify-center items-center flex-col max-lg:justify-start  w-[100%] lg:h-[100vh] max-lg:h-[100vh]  bg text-white"
      >
        <div className="w-full flex justify-center items-center  flex-col pt-5 max-lg:mt-[15rem] ">
          <h1 className="text-4xl mt-1 max-sm:text-3xl ">
            Chats
          </h1>
          <p className="font-montserrat text-lg mt-2 text-center max-lg:text-sm ">
          "Connecting Conversations, Anytime, Anywhere"
          </p>
          <button
            className="border-[1px]  border-white border-opacity-25 mt-8 p-3 shadow-lg btn rounded-lg text-white hover:border-white transition-all"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>
      </section>
      <p></p>
    </>
  );
};

export default LandingPage;
