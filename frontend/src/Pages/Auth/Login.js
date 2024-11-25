// LoginPage.js
import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";
import '../../App.css'

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

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

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { email, password } = values;
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^.{6,}$/;
  
    // Validate email
    if (!emailRegex.test(email)) {
      toast.error('Invalid Email Format', toastOptions);
      return;
    }
  
    // Validate password
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 6 characters long', toastOptions);
      return;
    }
  
    setLoading(true);
  
    try {
      const { data } = await axios.post(loginAPI, {
        email,
        password,
      });
  
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
        toast.success(data.message, toastOptions);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      // Handle 400 Bad Request error
      if (error.response && error.response.status === 400) {
        toast.error('Invalid login credentials', toastOptions);
      } else {
        toast.error('An error occurred during login', toastOptions);
      }
    } finally {
      setLoading(false);
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

      <Container
        className="mt-5"
        style={{ position: "relative", zIndex: "2 !important" }}
      >
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <h1 className="text-center mt-5">
              <AccountBalanceWalletIcon
                sx={{ fontSize: 40, color: "white" }}
                className="text-center"
              />
              
            </h1>
            <h1 className="text-white text-center" style={{ fontSize: '3rem' }} >Financio</h1>
            <h2 className="text-white text-center ">Login</h2>
            <Form>
              <Form.Group controlId="formBasicEmail" className="mt-3">
                <Form.Label className="text-white ">Email address</Form.Label>
                <Form.Control
                  className="custom-email-input"
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                  required
                />
              </Form.Group>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                className="mt-4"
              >
                {/* <Link to="/forgotPassword" className="text-white lnk">
                  Forgot Password?
                </Link> */}

                <Button
                  type="submit"
                  className=" text-center mt-3 btnStyle"
                  onClick={!loading ? handleSubmit : null}
                  disabled={loading}
                >
                  {loading ? "Signin…" : "Login"}
                </Button>

                <p className="mt-3" style={{ color: "#9d9494" }}>
                  No Account,no Problem! {" "}
                  <Link to="/register" className="text-white lnk">
                    Register
                  </Link>
                </p>
              </div>
              <Container fluid className="text-center mt-5">
      <h5 className="text-muted">Simplify your budgeting and take control of your finances</h5>
    </Container>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Login;
