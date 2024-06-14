/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const TestAndroid = () => {
  // const [loading, setLoading] = useState(false);

  // console.log(loading);

  const [devices, setDevices] = useState([]);
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
            device.label.toLowerCase().includes('back'),
        );
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          setSelectedDeviceId(
            videoDevices?.filter((value: any) => {
              value.label.includes('0');
            })[0].deviceId,
          );

          alert(
            videoDevices?.filter((value: any) => {
              value.label.includes('0');
            })[0].label,
          );
          setChange(true);
        }

        stream.getTracks().forEach((track) => track.stop());

        if (videoRef.current) {
          (videoRef.current as HTMLVideoElement).srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera: ', err);
      }
    }

    getCameraStream();
  }, []);

  console.log(devices);

  console.log(selectedDeviceId);

  const webcamRef: any = React.useRef(null);

  const capture = React.useCallback(() => {
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

  const [change, setChange] = useState(false);

  useEffect(() => {
    if (change === true) {
      setChange(false);
    }
  }, [change]);

  // useEffect(() => {
  //   // alert(selectedDeviceId);
  // }, [selectedDeviceId]);

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
        >
          {devices?.map((value: any, index) => {
            return (
              <button
                key={index}
                style={{ color: 'black', fontWeight: 'bold', height: '30px' }}
                onClick={() => {
                  setSelectedDeviceId(value?.deviceId);
                  setChange(true);
                }}
              >
                {value?.label}
              </button>
            );
          })}
        </div>
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
              width: '95vw',
              height: '35vh',
            }}
          >
            {change === false && (
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
