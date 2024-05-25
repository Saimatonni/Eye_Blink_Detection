import React from 'react';

const Contact = () => {
  return (
    <div style={contactStyle}>
      <h2 style={headerStyle}>Contact Us</h2>
      <p style={textStyle}>
        Feel free to reach out to us for any inquiries or support. 
        We're here to assist you and provide solutions to your questions.
      </p>
      <div style={infoStyle}>
        <p>Email: contact@eyeblinkdetection.com</p>
        <p>Phone: +1 (123) 456-7890</p>
        <p>Address: 123 Eye Blink St, City, Country</p>
      </div>
    </div>
  );
};

const contactStyle = {
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
  marginBottom: '20px',
};

const infoStyle = {
  backgroundColor: '#f4f4f4',
  padding: '15px',
  borderRadius: '5px',
};

export default Contact;
