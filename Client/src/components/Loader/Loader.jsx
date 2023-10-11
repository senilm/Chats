import { Watch } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className=" h-[100vh] w-full flex justify-center items-center">

    <Watch
      height="80"
      width="80"
      radius="48"
      color="#000000"
      ariaLabel="watch-loading"
      wrapperStyle={{}}
      wrapperClassName=""
      visible={true}
      />
      </div>
  );
};

export default Loader;
