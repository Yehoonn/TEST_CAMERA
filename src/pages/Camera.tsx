/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';

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
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // 후방 카메라 사용 설정
          },
        });

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
        }, 3000);

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
      const regex = /\d{2}-\d{2}-\d{6}-\d{2}/g;
      const matches = response.match(regex);

      // 결과 출력
      if (matches) {
        const newState: any = { data: state?.data, image: imageSrc };

        const hash = btoa(JSON.stringify(newState));

        window.location.href = `${state?.path?.split('#')[0]}#${hash}`;
      } else {
        capture();
        console.log('No matching patterns found.');
      }
    }
  }, [webcamRef]);

  const openMobileCam = () => {
    capture();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#404040',
      }}
    >
      <header
        className="header"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div
          style={{
            color: 'white',
            fontSize: '21px',
            fontWeight: 'bold',
            paddingTop: '5vh',
          }}
        >
          운전면허증 촬영
        </div>
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        ></div>
      </header>
      <main
        className="container type_btn"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          width: '100%',
          height: '100%',
          alignItems: 'baseline',
        }}
      >
        <article
          className="page_licenses"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
            paddingTop: '10vh',
          }}
        >
          <div
            className="box_sample"
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              width: '420px',
              height: '260px',
            }}
          >
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              marginTop: '35px',
            }}
          >
            <div
              style={{
                color: 'white',
                fontSize: '15px',
                fontWeight: 'bold',
                paddingTop: '5vh',
              }}
            >
              영역 안에 운전면허증을 맞추고
              <br />
              선명하게 보일 때 하단 버튼을 눌러
              <br />
              촬영해 주세요.
            </div>
            <div style={{ paddingBottom: '20px', paddingTop: '5vh' }}>
              <button
                style={{
                  display: 'none',
                  width: '50px',
                  marginTop: '20px',
                  height: '50px',
                  borderRadius: '50px',
                  backgroundColor: 'white',
                  paddingBottom: '20px',
                  border: '4px solid lightgray',
                }}
                onClick={openMobileCam}
                type="button"
                className="btn"
              ></button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};
export default TestAndroid;