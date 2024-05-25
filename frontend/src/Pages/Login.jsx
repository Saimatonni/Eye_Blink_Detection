import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/login.css";
import { FcGoogle } from "react-icons/fc";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleLogin = async () => {
    const requestBody = {
      email: email,
      password: password,
    };
  
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Failed to login");
      }
  
      const data = await response.json();
  
      const userData = {
        userid: data.data.userid,
        type: data.data.type,
      };
  
      Cookies.set("userdata", JSON.stringify(userData));
  
      if (data.data.type === "student") {
        navigate("/count-blink");
      } else if (data.data.type === "teacher") {
        navigate("/information");
      } 
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-con">
      <div className="rectangle_log">
        <h1 className="login_text">Login to your Account</h1>
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #03014C",
            padding: "10px",
            borderRadius: "10px",
            width: "250px",
            marginLeft: "50px",
            marginTop: "40px",
            cursor: "pointer",
          }}
        >
          <FcGoogle style={{ marginRight: "10px" }} />
          <span>Login with Google</span>
        </div> */}
        <div
          style={{
            marginLeft: "50px",
            marginTop: "40px",
            paddingRight: "40px",
          }}
        >
          <Label style={{ color: "#03014C" }}>Email Address</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              backgroundColor: "rgba(217, 217, 217, 0)",
              border: "none",
              borderBottom: "1px solid #11175D",
              height: "60px",
              outline: "none !important",
              borderRadius: "0",
              boxShadow: "none",
              padding: "0",
            }}
          />
        </div>

        <div
          style={{
            marginLeft: "50px",
            marginTop: "40px",
            paddingRight: "40px",
          }}
        >
          <Label style={{ color: "#03014C" }}>Password</Label>
          <div style={{ position: "relative" }}>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: "rgba(217, 217, 217, 0)",
                border: "none",
                borderBottom: "1px solid #11175D",
                height: "60px",
                outline: "none !important",
                borderRadius: "0",
                boxShadow: "none",
                padding: "0",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <RiEyeOffFill
                  style={{ fontSize: "1.5em", color: "#B2BEB5" }}
                />
              ) : (
                <RiEyeFill style={{ fontSize: "1.5em", color: "#B2BEB5" }} />
              )}
            </div>
          </div>
        </div>

        <Button
          color="primary"
          style={{
            width: "80%",
            height: "50px",
            margin: "10px auto",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#5F35F5",
            alignItems: "center",
            borderRadius: "10px",
            marginTop: "40px",
          }}
          onClick={handleLogin}
        >
          Login to Continue
        </Button>

        {/* Signup link */}

        <p style={{ textAlign: "center", marginTop: "20px", color: "#03014C" }}>
          Don’t have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#EA6C00", textDecoration: "none" }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
