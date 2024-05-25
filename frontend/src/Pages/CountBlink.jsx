import React, { useState , useEffect} from "react";
import "../styles/count-blink.css";
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
import { useNavigate } from "react-router-dom";
import CameraIcon from '../assets/images/camera.png'; 
import Cookies from 'js-cookie';

const CountBlink = () => {
  const [blinkCount, setBlinkCount] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const userId = Cookies.get('userdata') ? JSON.parse(Cookies.get('userdata')).userid : null;
  console.log("userid",userId)
  const navigate = useNavigate();
  const handleCounBlink = async () => {
    try {
      setStreaming(true);
      const response = await fetch("http://127.0.0.1:8000/start-stream/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }), 
      });
      if (response.ok) {
        console.log("Start stream request successful");
      } else {
        console.error("Failed to start stream:", response.statusText);
      }
    } catch (error) {
      console.error("Error starting stream:", error);
    }
  };

  const handleStopStream = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/stop-stream/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      if (response.ok) {
        console.log("Stop stream request successful");
        navigate("/blink-detect");
        setStreaming(false);
      } else {
        console.error("Failed to stop stream:", response.statusText);
      }
    } catch (error) {
      console.error("Error stopping stream:", error);
    }
  };
  

  const handleClose = () => {
    navigate("/login");
  };

  return (
    <div className="container-wrapper">
    <Container className="page-container2">
      <h1 className="page-heading">Blink Count</h1>
      <Row>
      <Col md={6} className="camera-column">
          <img src={CameraIcon} alt="Camera" className="camera-icon" />
        </Col>
        <Col md={5}  className="second-column">
            {streaming ? (
              <Button
              color="primary"
                style={{
                  width: "40%",
                  height: "50px",
                  margin: "10px auto",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "#065F19",
                  alignItems: "center",
                  borderRadius: "20px",
                  marginTop: "50%",
                  border: "0px"
                }}
                onClick={handleStopStream}
              >
                Stop Stream
              </Button>
            ) : (
              <Button
              color="primary"
              style={{
                width: "40%",
                height: "50px",
                margin: "10px auto",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#065F19",
                alignItems: "center",
                borderRadius: "20px",
                marginTop: "50%",
                border: "0px"
              }}
              onClick={handleCounBlink}
            >
              Start Stream
            </Button>
            )}

            <Button
              color="danger"
              style={{
                position: "absolute",
                bottom: "150px",
                right: "70px",
                borderRadius: "10px",
                width: "80px",
                height: "40px",
              }}
              onClick={handleClose}
            >
              logout
            </Button>
          {/* </div> */}
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default CountBlink;
