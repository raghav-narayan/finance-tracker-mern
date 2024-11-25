import React, { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import spinner from "../../assets/gg.gif";
import "./avatar.css";
import { Button } from "react-bootstrap";
import { setAvatarAPI } from "../../utils/ApiRequest.js";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

// import Buffer from "buffer";
const {
  uniqueNamesGenerator,
  colors,
  animals,
  countries,
  names,
  languages,
} = require("unique-names-generator");

const SetAvatar = () => {
  const sprites = [
    "bottts",
    "cute-animals",
    "colorful-flat",
    "abstract-pixel",
    "minimal-neutral",
    "personas",
    "pixel-art-neutral",
    "croodles",
    "identicon",
    "open-peeps",
  ];
  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const navigate = useNavigate();

  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [selectedSprite, setSelectedSprite] = React.useState(sprites[0]);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);

  const randomName = () => {
    let shortName = uniqueNamesGenerator({
      dictionaries: [animals, colors, countries, names, languages], // colors can be omitted here as not used
      length: 2,
    });
    // console.log(shortName);

    return shortName;
  };

  const [imgURL, setImgURL] = React.useState([
    `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`,
    `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`,
    `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`,
    `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`,
  ]);

  const handleSpriteChange = (e) => {
    setSelectedSprite(() => {
      if (e.target.value.length > 0) {
        setLoading(true);
        const imgData = [];
        for (let i = 0; i < 4; i++) {
          imgData.push(
            `https://api.dicebear.com/7.x/${
              e.target.value
            }/svg?seed=${randomName()}`
          );
        }

        setImgURL(imgData);
        // console.log(imgData);
        setLoading(false);
      }

      return e.target.value;
    });
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      // console.log(user);

      const { data } = await axios.post(`${setAvatarAPI}/${user._id}`, {
        image: imgURL[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Avatar selected successfully", toastOptions);
        navigate("/");
      } else {
        toast.error("Error Setting avatar, Please Try again", toastOptions);
      }
    }
  };

  const particlesInit = useCallback(async (engine) => {
    // console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container);
  }, []);

  return (
    <>
      <div style={{ position: "relative", overflow: "hidden" }}>
      <Particles
  id="tsparticles"
  init={particlesInit}
  loaded={particlesLoaded}
  options={{
    background: {
      color: {
        value: "#1a1a1a", // Dark gray background
      },
    },
    fpsLimit: 75, // Increased FPS limit for smoother animation
    particles: {
      number: {
        value: 150, // Fewer particles
        density: {
          enable: true,
          value_area: 1000, // Increased area for particle density
        },
      },
      color: {
        value: "#00ffcc", // Teal color for the particles
      },
      shape: {
        type: "triangle", // Triangle shape for variation
      },
      opacity: {
        value: 0.8, // Higher opacity
        random: true,
      },
      size: {
        value: 4, // Larger base size
        random: { enable: true, minimumValue: 1.5 },
      },
      links: {
        enable: true, // Enabled linking
        distance: 150,
        color: "#00ffcc",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 3, // Faster movement
        direction: "top", // Particles move upward
        random: false,
        straight: false,
        out_mode: "out", // Particles reappear when going out of bounds
        bounce: false,
      },
      life: {
        duration: {
          sync: false,
          value: 4, // Longer lifespan
        },
        count: 0,
        delay: {
          random: {
            enable: true,
            minimumValue: 0.3,
          },
          value: 1.2, // Slightly longer delay
        },
      },
    },
    detectRetina: true,
  }}
  style={{
    position: "absolute",
    zIndex: -1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }}
        />

        {loading === true ? (
          <>
            {/* <Container></Container> */}
            <div
              className="container containerBox"
              h={"100vh"}
              style={{ position: "relative", zIndex: "2 !important" }}
            >
              <div className="avatarBox">
                <image src={spinner} alt="Loading"></image>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className="container containerBox"
              style={{ position: "relative", zIndex: "2 !important" }}
            >
              <div className="avatarBox">
                <h1 className="text-center text-white mt-5">
                  Choose Your Avatar
                </h1>
                {/* <div className="imgBox">
                        
                        {imgURL.map((image, index)=> {

                            console.log(image);
                            return(
                                <img key={index} src={image} alt="" className={`avatar ${selectedAvatar === index ? "selected" : ""} img-circle imgAvatar`} onClick={() => setSelectedAvatar(index)} width="250px" height="250px"/>
                            )
                        })}
                            
                        

                    </div> */}
                <div className="container">
                  <div className="row">
                    {imgURL.map((image, index) => {
                      console.log(image);
                      return (
                        <div key={index} className="col-lg-3 col-md-6 col-6">
                          <img
                            src={image}
                            alt=""
                            className={`avatar ${
                              selectedAvatar === index ? "selected" : ""
                            } img-circle imgAvatar mt-5`}
                            onClick={() => setSelectedAvatar(index)}
                            width="100%"
                            height="auto"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <select
                  onChange={handleSpriteChange}
                  className="form-select mt-5"
                >
                  {sprites.map((sprite, index) => (
                    <option value={sprite} key={index}>
                      {sprite}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={setProfilePicture}
                  type="submit"
                  className="mt-5"
                >
                  Set as Profile Picture
                </Button>
              </div>

              <ToastContainer />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SetAvatar;
