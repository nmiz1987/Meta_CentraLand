import "./Welcome.css";
import picture from "../../img/pic.png";
import video from "../../video/welcome-video.mp4";
import { useRef, useEffect } from "react";

const Welcome = () => {
  const vidRef = useRef();

  useEffect(() => {
    localStorage.removeItem("BuyLand");
    localStorage.removeItem("user");
    vidRef.current.play();
  }, []);

  return (
    <div className="picture">
      <video width="50%" ref={vidRef} controls>
        <source src={video} type="video/mp4" />{" "}
      </video>
      <img src={picture} alt="Welcome" width="700" height="400"></img>
    </div>
  );
};

export default Welcome;
