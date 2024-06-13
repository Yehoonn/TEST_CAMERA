/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

const Test = () => {
  const [loading, setLoading] = useState(false);

  console.log(loading);

  function getStateFromHash() {
    const hash = window.location.hash.substr(1); // '#' 제거 후 해시 값 가져오기
    if (hash) {
      try {
        const decoded = atob(hash); // Base64 디코딩
        const state = JSON.parse(decoded); // JSON 파싱
        return state;
      } catch (e) {
        console.error('Error decoding state from hash:', e);
        return null;
      }
    }
    return null;
  }

  const state = getStateFromHash();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    async function getCameraStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // 후방 카메라 사용 설정
          },
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

            // downloadFile(compressedFile);

            const base64: any = await blobToBase64(compressedFile);

            const newState: any = { data: state?.data, image: base64 };

            const hash = btoa(JSON.stringify(newState)); // state를 문자열로 변환 후 base64로 인코딩

            window.location.href = `${state?.path?.split('#')[0]}#${hash}`;
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

  const blobToBase64 = (blob: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const cameraStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '350px',
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
            if (state?.kt) {
              const newState: any = { data: state?.data };

              const hash = btoa(JSON.stringify(newState)); // state를 문자열로 변환 후 base64로 인코딩

              // window.location.href = `https://main--cozy-tanuki-0ad879.netlify.app#${hash}`;

              window.location.href = `${state?.path?.split('#')[0]}#${hash}`;
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
                style={{ width: '100%', height: '100%' }}
              ></video>
            </div>
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
              width="100%"
              height="100%"
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
