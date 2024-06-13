import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { useLocation, useNavigate } from 'react-router-dom';

const Test = () => {
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  console.log(location);

  console.log(loading);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    async function getCameraStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          (videoRef.current as HTMLVideoElement).srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera: ', err);
      }
    }
    getCameraStream();
  }, []);
  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context != null) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'capture.png', { type: 'image/png' });
            setLoading(true);
            const compressedFile = await compressImage(file);

            console.log(compressedFile);
          }
        }, 'image/png');
      }
    }
  };
  const openMobileCam = () => {
    captureImage();
  };
  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Image compression error:', error);
      return file;
    }
  };

  const cameraStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    height: '250px',
    background: `
      linear-gradient(to right, #21005D 4px, transparent 4px) 0 0,
      linear-gradient(to right, #21005D 4px, transparent 4px) 0 100%,
      linear-gradient(to left, #21005D 4px, transparent 4px) 100% 0,
      linear-gradient(to left, #21005D 4px, transparent 4px) 100% 100%,
      linear-gradient(to bottom, #21005D 4px, transparent 4px) 0 0,
      linear-gradient(to bottom, #21005D 4px, transparent 4px) 100% 0,
      linear-gradient(to top, #21005D 4px, transparent 4px) 0 100%,
      linear-gradient(to top, #21005D 4px, transparent 4px) 100% 100%
    `,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '20px 20px',
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        width: '100vw',
        height: '100vh',
      }}
    >
      <header className="header">
        <button
          style={{
            marginTop: '30px',
          }}
          type="button"
          className="btn_back"
          onClick={() => {
            if (location.state !== null) {
              navigate(-1);
            } else {
              console.log('으악');
            }
          }}
        >
          뒤로가기
        </button>
      </header>
      <main className="container type_btn" style={{ alignItems: 'baseline' }}>
        <article
          className="page_licenses"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
          }}
        >
          <div>
            <>
              차량 예약을 위해
              <br />
              <span className="point">운전면허증을 준비해 주세요.</span>
            </>
          </div>
          <div
            className="box_sample"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div style={cameraStyle}>
              <video
                ref={videoRef}
                autoPlay
                style={{ width: '90%', height: '95%' }}
              ></video>
            </div>
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
              width="640"
              height="480"
            ></canvas>
          </div>
        </article>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '20px',
          }}
        >
          <div>어두운 배경에 가로로 놓아주세요.</div>
          <div>빛 반사를 없애 주세요.</div>
          <div>카메라 초점을 맞추고 촬영해 주세요.</div>
        </div>
        <button
          style={{
            marginTop: '20px',
          }}
          onClick={openMobileCam}
          type="button"
          className="btn"
        >
          운전면허증 촬영하기
        </button>
      </main>
    </div>
  );
};
export default Test;
