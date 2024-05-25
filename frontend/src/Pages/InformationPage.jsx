import React, { useState, useEffect } from 'react';
import "../styles/information.css";

const InformationPage = () => {
  const [blinkData, setBlinkData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/blink_detection_results/')
      .then(response => response.json())
      .then(data => {
        setBlinkData(data);
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); 
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="information-container">
      {blinkData?.reverse().map((item) => (
        <div key={item.id} className="card">
          <h2>Name: {item.username}</h2>
          <img src={`data:image/png;base64,${item.plot_image}`} alt="Plot" />
          <p>Average Blink: {item.average_blink.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

export default InformationPage;
