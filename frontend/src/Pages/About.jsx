import React from 'react';

const About = () => {
  return (
    <div style={aboutStyle}>
      <h2 style={headerStyle}>About Eye Blink Detection</h2>
      <p style={textStyle}>
        Eye blink detection is a feature of our application designed to monitor and analyze blink patterns. 
        It utilizes advanced algorithms to detect blinks and provides insights into user attention levels.
      </p>
      <p style={textStyle}>
        Our goal is to help users understand their blink behavior and its impact on concentration and focus. 
        By analyzing blink data, our application provides valuable feedback to improve productivity 
        and enhance overall well-being.
      </p>
    </div>
  );
};

const aboutStyle = {
  margin: 'auto',
  maxWidth: '600px',
  padding: '20px',
};

const headerStyle = {
  color: '#333',
  textAlign: 'center',
};

const textStyle = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '1.6',
};

export default About;
