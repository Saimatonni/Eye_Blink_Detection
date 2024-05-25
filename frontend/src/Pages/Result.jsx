import React, { useState, useEffect } from "react";
import "../styles/attention.css";
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
import Attention from "../assets/images/attention_bg.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Result = () => {
  const userId = Cookies.get("userdata")
    ? JSON.parse(Cookies.get("userdata")).userid
    : null;
  const resultPageStyle = {
    backgroundImage: `url(${Attention})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: "90vh",
    color: "#fff",
  };

  const [averageBlink, setAverageBlink] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/blink_detection_results/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.average_blink) {
          setAverageBlink(data.average_blink);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blink detection result:", error);
        setLoading(false); 
      });
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const rectangleStyle = {
    backgroundColor: "#D9D9D9",
    width: "30%",
    height: "90px",
    padding: "20px",
    textAlign: "center",
    marginLeft: "40%",
    marginTop: "5%",
  };

  const textStyle = {
    fontSize: "30px",
    color: "#0C467B",
    fontWeight: "bold",
  };

  const rectangleStyle2 = {
    backgroundColor: "#D9D9D9",
    width: "15%",
    height: "60px",
    padding: "20px",
    textAlign: "center",
    marginLeft: "47%",
    marginTop: "10px",
  };

  const textStyle2 = {
    fontSize: "20px",
    color: "#0C467B",
  };

  return (
    <Container fluid style={resultPageStyle}>
      <Row>
        <Col>
          <div style={rectangleStyle}>
            <p style={textStyle}>
              Your Average Blink is {averageBlink?.toFixed(2)}
            </p>
          </div>
          <div style={rectangleStyle2}>
            <p style={textStyle2}>
              You are{" "}
              {averageBlink && averageBlink < 30 ? "attentive" : "inattentive"}
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Result;
