const Welcome = ({ currentUserInfo }) => {
  return (
    <div className="flex justify-center items-center w-full min-h-full flex-col">
      <div className=" text-4xl  animate-pulse text-white">
        Welcome,{currentUserInfo.name}
      </div>
      <p className="mt-3  font-extralight text-white">"Pick one to Poke"</p>
    </div>
  );
};

export default Welcome;
