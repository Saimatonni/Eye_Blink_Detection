import React, { useEffect, useRef, useState } from 'react';

const VideoStream = () => {
  const videoRef = useRef();
  const [streamLoaded, setStreamLoaded] = useState(false);

  useEffect(() => {
    const fetchVideoStream = async () => {
      try {
        if (!streamLoaded) {
          const response = await fetch('http://127.0.0.1:8000/eye-blink/');
          console.log("res", response)
          const reader = response.body.getReader();
          const stream = new ReadableStream({
            start(controller) {
              function push() {
                reader.read().then(({ done, value }) => {
                  if (done) {
                    console.log('Stream complete');
                    controller.close();
                    return;
                  }
                  controller.enqueue(value);
                  push();
                }).catch(error => {
                  console.error('Stream error:', error);
                  controller.error(error);
                });
              }
              push();
            }
          });
          const url = URL.createObjectURL(new Response(stream).body);
          videoRef.current.srcObject = await fetch(url).then(response => response.blob());
          setStreamLoaded(true);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchVideoStream();

    return () => {
      // Cleanup code, if any
    };
  }, [streamLoaded]);

  return (
    <div>
      <h1>Eye Blink Detection</h1>
      <video ref={videoRef} width="640" height="480" autoPlay controls></video>
    </div>
  );
};

export default VideoStream;






