import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, } from "reactstrap";
import { Link } from 'react-router-dom';
import '../styles/register.css';
import registerImg from '../assets/images/register.png';
import userIcon from '../assets/images/user.png';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [userType, setUserType] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = () => {
    const requestBody = {
      name: name,
      email: email,
      password: password,
      type: userType
    };

    fetch('http://127.0.0.1:8000/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (response.ok) {
        console.log('User registered successfully');
        navigate('/login')
      } else {
        throw new Error('Failed to register user');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="login-container">
      <div className="rectangle">
        <h1 className="measure-attentiveness-text">Measure Attentiveness</h1>
        <FormGroup style={{ paddingLeft: "40px", paddingRight: "40px" }}>
          {/* <Label for="email" className="label-with-bg">
            Email Address
          </Label> */}
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              backgroundColor: "rgba(217, 217, 217, 0)",
              border: "1px solid #11175D",
              height: "60px",
              outline: "none",
              paddingLeft: "40px",
            }}
          />
        </FormGroup>

        <FormGroup style={{ paddingLeft: "40px", paddingRight: "40px" }}>
          {/* <Label for="fullName" className="label-with-bg">
            Full Name
          </Label> */}
          <Input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              backgroundColor: "rgba(217, 217, 217, 0)",
              border: "1px solid #11175D",
              height: "60px",
              outline: "none",
              paddingLeft: "40px",
            }}
          />
        </FormGroup>

        <FormGroup style={{ paddingLeft: "40px", paddingRight: "40px" }}>
          {/* <Label for="password" className="label-with-bg">
            Password
          </Label> */}
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              backgroundColor: "rgba(217, 217, 217, 0)",
              border: "1px solid #11175D",
              height: "60px",
              outline: "none",
              paddingLeft: "40px",
            }}
          />
        </FormGroup>

        <FormGroup style={{ paddingLeft: "40px", paddingRight: "40px" }}>
          <Label for="userType" className="label-with-bg">User Type</Label>
          <Input
            type="select"
            name="userType"
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            style={{
              backgroundColor: "rgba(217, 217, 217, 0)",
              border: "1px solid #11175D",
              height: "60px",
              outline: "none",
              paddingLeft: "40px",
            }}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </Input>
        </FormGroup>

        <Button
          color="primary"
          style={{
            width: "85%",
            height: "50px",
            margin: "10px auto",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#5F35F5",
            alignItems: "center",
            borderRadius: "10px",
          }}
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
        <p style={{ textAlign: "center", marginTop: "20px", color: "#03014C" }}>
          Already have an account? <Link to="/login" style={{ color: "#EA6C00", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
