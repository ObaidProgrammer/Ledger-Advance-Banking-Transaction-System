import React from 'react'
import loaderAnimation from "../assets/lottie/Loader.json";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";


const Loader = () => {
  return (
    <div className="loader">
      <div className="load">
        <DotLottieReact
          data={loaderAnimation}
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default Loader
