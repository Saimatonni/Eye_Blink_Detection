import React, { useState , useEffect} from "react";
import "../styles/blink-detect.css";
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
  import CameraIcon from '../assets/images/count_blink2.png'; 
  import Cookies from 'js-cookie';
  import Particles from "react-tsparticles";
  
  const BlinkDetect = () => {
    const [blinkCount, setBlinkCount] = useState(0);
    const [streaming, setStreaming] = useState(false);
    const userId = Cookies.get('userdata') ? JSON.parse(Cookies.get('userdata')).userid : null;
    console.log("userid",userId)
    const navigate = useNavigate();
    const handleCounBlink = async () => {
      try {
        setStreaming(true);
        const response = await fetch("http://127.0.0.1:8000/start-detect/", {
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
        const response = await fetch("http://127.0.0.1:8000/stop-detect/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId }),
        });
        if (response.ok) {
          console.log("Stop stream request successful");
          navigate("/result");
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
        <div className="container-wrapper2">
      <Container className="page-container">
        <h1 className="page-heading2">Detect Blink</h1>
        <Row>
        <Col md={6} className="camera-column2">
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
                  Stop Detection
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
                Start Detection
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
  
  export default BlinkDetect;
  