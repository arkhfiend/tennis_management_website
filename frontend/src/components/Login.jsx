import React, { useState, useContext } from "react";
import user_icon from "../../public/assets/person.png";
import email_icon from "../../public/assets/email.png";
import password_icon from "../../public/assets/password.png";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from './authContext';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState("Login");
  const navigate = useNavigate();
  const { setAuthenticated } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/Login", {
        email: email,
        password: password
      });

      console.log("Response from backend:", response);

      if (response.data.status === "success") {
        toast.success(response.data.message, { autoClose: 5000 }); // Set autoClose to 5 seconds
        setAuthenticated(true); // Update authenticated state

        const userType = response.data.user_type;
        setTimeout(() => {
          if (userType === "1") {
            navigate("/admin");
          } else if (userType === "2") {
            navigate("/staff");
          } else if (userType === "3") {
            navigate("/student");
          } else {
            toast.error("Unknown user type. Please contact support.", { autoClose: 5000 });
          }
        }, 5000); // Delay navigation by 5 seconds

      } else {
        toast.error("Login failed. Please try again.", { autoClose: 5000 });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "An error occurred. Please try again.", { autoClose: 5000 });
      } else {
        toast.error("An error occurred. Please try again.", { autoClose: 5000 });
      }
      console.error("Error during login:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          {action === "Login" ? null : (
            <div className="input">
              <img src={user_icon} alt="" />
              <input
                type="text"
                placeholder="Name"
              />
            </div>
          )}

          <div className="input">
            <img src={email_icon} alt="" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              required
            />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
            />
          </div>
        </div>
        {action === "Sign Up" ? null : (
          <div className="forgot-password">
            Lost password? <span>click here</span>
          </div>
        )}

        <div className="submit-container">
          <button
            type="submit"
            className={action === "Sign Up" ? "submit gray" : "submit"}
          >
            {action}
          </button>

          <div
            className={action === "Login" ? "submit gray" : "submit"}
            onClick={() => setAction(action === "Login" ? "Sign Up" : "Login")}
          >
            {action === "Login" ? "Sign Up" : "Login"}
          </div>
        </div>
        <ToastContainer autoClose={5000} /> {/* Set global autoClose to 5 seconds */}
      </div>
    </form>
  );
}

export default Login;