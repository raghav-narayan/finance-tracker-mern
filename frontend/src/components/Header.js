import React, { useCallback, useEffect, useState } from 'react';
import { Navbar, Nav, Button, Image } from 'react-bootstrap';
import "./style.css";
import { useNavigate } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Header = () => {
  const navigate = useNavigate();

  const handleShowLogin = () => {
    navigate("/login");
  };

  const [user, setUser] = useState();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log('user', user);
      setUser(user);
    }
  }, []);

  const handleShowLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // console.log(container);
  }, []);

  return (
    <>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
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
        <Navbar
          className="navbarCSS"
          collapseOnSelect
          expand="lg"
          style={{
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'rgba(50, 50, 50, 0.8)', // Brighter gray with some opacity
          }}
        >
          <Navbar.Brand href="/" className="text-white navTitle">
            Finance Management System
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
          >
            <span
              className="navbar-toggler-icon"
              style={{
                background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`,
              }}
            ></span>
          </Navbar.Toggle>

          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="ml-auto d-flex justify-content-between align-items-center w-100"
            style={{ color: 'white' }}
          >
            <div className="navbar-center d-flex justify-content-center w-100">
              {user ? (
                <>
                  <div className="navbar-avatar d-flex align-items-center">
                    <span className="text-white mr-2" style={{ fontSize: '18px', fontWeight: '600' }}>
                      Welcome, {user.name}
                    </span>
                    <Image
                      src={user.avatarImage}
                      alt="Avatar"
                      roundedCircle
                      className="mr-2"
                      style={{ width: '40px', height: '40px' }}
                    />
                  </div>
                </>
              ) : null}
            </div>

            <div className="navbar-right">
              {user ? (
                <Button
                  variant="danger"
                  onClick={handleShowLogout}
                  className="logout-button navbar-button"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleShowLogin}
                  className="login-button navbar-button"
                >
                  Login
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </>
  );
};

export default Header;
