/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from 'react';
import Header from '../Components/header/header';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { Link } from 'react-router-dom';

const TestAndroid = () => {
  const [selectedDeviceId, setSelectedDeviceId]: any = useState('');

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
        // const permissionStatus = localStorage.getItem('cameraPermission');

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // 후방 카메라 사용 설정
          },
        });
        // localStorage.setItem('cameraPermission', 'granted');

        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoDevices: any = devices.filter(
          (device) =>
            device.kind === 'videoinput' &&
            device.label.toLowerCase().includes('back') &&
            device.label.includes('0'),
        );

        const videoDevices2: any = devices.filter(
          (device) =>
            device.kind === 'videoinput' &&
            device.label.toLowerCase().includes('back'),
        );

        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        } else {
          setSelectedDeviceId(videoDevices2[0]?.deviceId);
        }

        stream.getTracks().forEach((track) => track.stop());

        setTimeout(() => {
          openMobileCam();
        }, 1000);

        if (videoRef.current) {
          (videoRef.current as HTMLVideoElement).srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera: ', err);
      }
    }

    getCameraStream();
  }, []);

  const webcamRef: any = React.useRef(null);

  const capture = React.useCallback(async () => {
    if (webcamRef.current !== null) {
      const imageSrc: any = webcamRef.current.getScreenshot();

      const {
        data: { text: response },
      } = await Tesseract.recognize(imageSrc, 'kor');

      // 정규표현식을 이용하여 "숫자-숫자-숫자-숫자" 형식을 찾음
      const numberRegex = /\d{2}-\d{2}-\d{6}-\d{2}/g;
      const dateRegex = /\d{4}\.\d{2}\.\d{2}/g;
      const licenseRegex = /면[허혀]증/g;
      const renewalRegex = /갱[신슬]기간/g;

      let count = 0;

      response.match(numberRegex) === null ? (count += 0) : (count += 1);
      response.match(dateRegex) === null ? (count += 0) : (count += 1);
      response.match(licenseRegex) === null ? (count += 0) : (count += 1);
      response.match(renewalRegex) === null ? (count += 0) : (count += 1);

      // 결과 출력
      if (count >= 1) {
        const newState: any = { data: state?.data, image: imageSrc };
        const hash = btoa(JSON.stringify(newState));
        window.location.href = `${state?.path?.split('#')[0]}#${hash}`;
      } else {
        capture();
      }
    }
  }, [webcamRef]);

  const captureClick = React.useCallback(async () => {
    if (webcamRef.current !== null) {
      const imageSrc: any = webcamRef.current.getScreenshot();

      const newState: any = { data: state?.data, image: imageSrc };
      const hash = btoa(JSON.stringify(newState));
      window.location.href = `${state?.path?.split('#')[0]}#${hash}`;
    }
  }, [webcamRef]);

  const openMobileCam = () => {
    capture();
  };

  const openMobileCamClick = () => {
    captureClick();
  };

  const btnCancel = () => {
    window.location.href = `${state?.path?.split('#')[0]}`;
  };

  return (
    // <div
    //   style={{
    //     display: 'flex',
    //     flexDirection: 'column',
    //     width: '100vw',
    //     minHeight: '100vh',
    //     backgroundColor: '#404040',
    //   }}
    // >
    //   <header
    //     className="header"
    //     style={{ display: 'flex', flexDirection: 'column' }}
    //   >
    //     <div
    //       style={{
    //         color: 'white',
    //         fontSize: '21px',
    //         fontWeight: 'bold',
    //         paddingTop: '5vh',
    //       }}
    //     >
    //       운전면허증 촬영
    //     </div>
    //     <div
    //       style={{
    //         marginTop: '10px',
    //         display: 'flex',
    //         flexDirection: 'column',
    //         gap: '10px',
    //       }}
    //     ></div>
    //   </header>
    //   <main
    //     className="container type_btn"
    //     style={{
    //       display: 'flex',
    //       flexDirection: 'column',
    //       justifyContent: 'space-around',
    //       width: '100%',
    //       height: '100%',
    //       alignItems: 'baseline',
    //     }}
    //   >
    //     <article
    //       className="page_licenses"
    //       style={{
    //         width: '100%',
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         gap: '30px',
    //         paddingTop: '10vh',
    //       }}
    //     >
    //       <div
    //         className="box_sample"
    //         style={{
    //           position: 'relative',
    //           display: 'flex',
    //           justifyContent: 'center',
    //           width: '420px',
    //           height: '260px',
    //         }}
    //       >
    //         {selectedDeviceId !== '' && (
    //           <Webcam
    //             style={{
    //               width: '100%',
    //               height: '100%',
    //               objectFit: 'cover',
    //               position: 'absolute',
    //               top: 0,
    //               left: 0,
    //             }}
    //             ref={webcamRef}
    //             audio={false}
    //             screenshotFormat="image/jpeg"
    //             videoConstraints={{
    //               width: 420,
    //               height: 540,
    //               facingMode: 'environment',
    //               aspectRatio: 16 / 9,
    //               frameRate: 30,
    //               deviceId: selectedDeviceId,
    //             }}
    //             onUserMediaError={(error) => alert(error)}
    //           />
    //         )}

    //         <canvas ref={canvasRef} style={{ display: 'none' }} />
    //       </div>
    //       <div
    //         style={{
    //           display: 'flex',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           flexDirection: 'column',
    //           marginTop: '35px',
    //         }}
    //       >
    //         <div
    //           style={{
    //             color: 'white',
    //             fontSize: '15px',
    //             fontWeight: 'bold',
    //             paddingTop: '5vh',
    //           }}
    //         >
    //           영역 안에 운전면허증을 맞추고
    //           <br />
    //           선명하게 보일 때 하단 버튼을 눌러
    //           <br />
    //           촬영해 주세요.
    //         </div>
    //         <div style={{ paddingBottom: '20px', paddingTop: '5vh' }}>
    //           <button
    //             style={{
    //               width: '50px',
    //               marginTop: '20px',
    //               height: '50px',
    //               borderRadius: '50px',
    //               backgroundColor: 'white',
    //               paddingBottom: '20px',
    //               border: '4px solid lightgray',
    //             }}
    //             onClick={openMobileCam}
    //             type="button"
    //             className="btn"
    //           ></button>
    //         </div>
    //       </div>
    //     </article>
    //   </main>
    // </div>

    <>
      <Header
        className="type_camera"
        title="운전면허증 촬영"
        useCancel={true}
        onCancel={btnCancel}
      />
      <main className="container type_camera">
        <article
          className="page_licenses camera-wrap"
          style={{ alignItems: 'center' }}
        >
          <p className="camera_disc">
            영역 안에 운전면허증을 맞추고 <br />
            선명하게 보일 때 <br />
            하단 버튼을 눌러 촬영해 주세요.
          </p>

          <div
            className="camera_area"
            style={{
              background: '#000',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              width: '95vw',
              height: '260px',
            }}
          >
            <span style={{ zIndex: 2 }}></span>
            <span style={{ zIndex: 2 }}></span>
            <span style={{ zIndex: 2 }}></span>
            <span style={{ zIndex: 2 }}></span>

            {selectedDeviceId !== '' && (
              <Webcam
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 420,
                  height: 540,
                  facingMode: 'environment',
                  aspectRatio: 16 / 9,
                  frameRate: 30,
                  deviceId: selectedDeviceId,
                }}
                onUserMediaError={(error) => alert(error)}
              />
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </article>

        <div className="btn-area">
          <Link
            to="/"
            className=""
            onClick={(e: any) => {
              e.preventDefault();

              window.location.href = `${state?.path?.split('#')[0]}/confirm`;
            }}
          >
            직접입력
          </Link>
          <button onClick={openMobileCamClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65"
              height="65"
              viewBox="0 0 65 65"
              fill="none"
            >
              <circle
                cx="32.5"
                cy="32.6777"
                r="29.5"
                fill="#0E0A1A"
                stroke="#6750A4"
                strokeWidth="5"
              />
            </svg>
          </button>
        </div>
      </main>
    </>
  );
};
export default TestAndroid;
