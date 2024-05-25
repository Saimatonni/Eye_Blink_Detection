import React, { useRef, useState } from 'react';


const Eye_Blink = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  let stream = null;

  const startStreaming = async () => {
    const constraints = {
      video: true,
    };

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        // Capture the video stream as a Blob
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        const chunks = [];
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          // Convert the video Blob to MP4 format
          const videoUrl = URL.createObjectURL(blob);
          const videoElement = document.createElement('video');
          videoElement.src = videoUrl;
          videoElement.controls = true;
          videoElement.onloadedmetadata = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(async (mp4Blob) => {
              const formData = new FormData();
              formData.append('video', mp4Blob, 'video.mp4');
              console.log("formdata",formData)
              const response = await fetch('http://127.0.0.1:8000/eye-blink/', {
                method: 'POST',
                body: formData,
              });
              const data = await response.json();
              setBlinkCount(data.blink_count);
            }, 'video/mp4');
          };
        };
        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000); // Record for 5 seconds (adjust as needed)
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopStreaming = () => {
    // Stop the video stream
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  return (
    <div>
      <h1>Eye Blink Page</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '300px', height: '400px' }}
      ></video>
      <p>Blink Count: {blinkCount}</p>
      <button onClick={startStreaming}>Start Streaming</button>
      <button onClick={stopStreaming}>Stop Streaming</button>
    </div>
  );
};

export default Eye_Blink;



