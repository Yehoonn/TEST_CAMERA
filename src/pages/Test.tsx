/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

const Test = () => {
  // const [loading, setLoading] = useState(false);

  // console.log(loading);

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
    // setLoading(true);
    capture();
    // captureImage();
  };
  // const compressImage = async (file: File) => {
  //   const options = {
  //     maxSizeMB: 0.2,
  //     maxWidthOrHeight: 1024,
  //     useWebWorker: true,
  //   };
  //   try {
  //     const compressedFile = await imageCompression(file, options);
  //     return compressedFile;
  //   } catch (error) {
  //     console.error('Image compression error:', error);
  //     return file;
  //   }
  // };

  // const blobToBase64 = (blob: any) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // };

  // const cameraStyle = {
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   width: '100vw',
  //   height: '350px',
  //   background: `
  //     linear-gradient(to right, #21005D 4px, transparent 4px) 0 0,
  //     linear-gradient(to right, #21005D 4px, transparent 4px) 0 100%,
  //     linear-gradient(to left, #21005D 4px, transparent 4px) 100% 0,
  //     linear-gradient(to left, #21005D 4px, transparent 4px) 100% 100%,
  //     linear-gradient(to bottom, #21005D 4px, transparent 4px) 0 0,
  //     linear-gradient(to bottom, #21005D 4px, transparent 4px) 100% 0,
  //     linear-gradient(to top, #21005D 4px, transparent 4px) 0 100%,
  //     linear-gradient(to top, #21005D 4px, transparent 4px) 100% 100%
  //   `,
  //   backgroundRepeat: 'no-repeat',
  //   backgroundSize: '20px 20px',
  // };

  // const detectObjectInBox = () => {
  //   if (canvasRef.current !== null) {
  //     const canvas = canvasRef.current;
  //     const context = canvas.getContext('2d');

  //     if (context !== null) {
  //       context.drawImage(
  //         webcamRef.current.video,
  //         0,
  //         0,
  //         canvas.width,
  //         canvas.height,
  //       );

  //       // 특정 박스 영역 설정 (예: 화면 중앙의 200x200 박스)
  //       const boxX = canvas.width / 2 - 100;
  //       const boxY = canvas.height / 2 - 100;
  //       const boxWidth = 200;
  //       const boxHeight = 200;

  //       // 박스 내부의 픽셀 데이터 가져오기
  //       const imageData = context.getImageData(boxX, boxY, boxWidth, boxHeight);
  //       const data = imageData.data;

  //       // 단순히 픽셀 데이터의 평균 밝기를 기준으로 물체 감지 (예시)
  //       let sum = 0;
  //       for (let i = 0; i < data.length; i += 4) {
  //         const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
  //         sum += brightness;
  //       }
  //       const averageBrightness = sum / (data.length / 4);

  //       // 주변 밝기 확인을 위한 전체 이미지 밝기 계산
  //       const overallImageData = context.getImageData(
  //         0,
  //         0,
  //         canvas.width,
  //         canvas.height,
  //       );
  //       const overallData = overallImageData.data;

  //       let overallSum = 0;
  //       for (let i = 0; i < overallData.length; i += 4) {
  //         const brightness =
  //           (overallData[i] + overallData[i + 1] + overallData[i + 2]) / 3;
  //         overallSum += brightness;
  //       }
  //       const overallAverageBrightness = overallSum / (overallData.length / 4);

  //       // 임계값을 기준으로 물체가 있는지 판단 (임계값은 상황에 따라 조정)
  //       const objectThreshold = 100;
  //       const ambientLightThreshold = 50;

  //       if (
  //         averageBrightness < objectThreshold &&
  //         overallAverageBrightness > ambientLightThreshold
  //       ) {
  //         capture();
  //       }
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const interval = setInterval(detectObjectInBox, 1000); // 1초 간격으로 감지
  //   return () => clearInterval(interval);
  // }, [detectObjectInBox]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#404040',
        justifyContent: 'space-around',
      }}
    >
      <header
        className="header"
        style={{ display: 'flex', marginTop: '50px', flexDirection: 'column' }}
      >
        {/* <button
          style={{
            height: '50px',
            marginTop: '30px',
          }}
          type="button"
          className="btn_back"
          onClick={() => {
            if (state?.kt) {
              const newState: any = { data: state?.data };

              const hash = btoa(JSON.stringify(newState)); // state를 문자열로 변환 후 base64로 인코딩

              window.location.href = `${state?.path?.split('#')[0]}#${hash}`;
            } else {
              console.log('으악');
            }
          }}
        >
          뒤로가기
        </button> */}
        <div style={{ color: 'white', fontSize: '21px', fontWeight: 'bold' }}>
          운전면허증 촬영
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
          }}
        >
          <div
            className="box_sample"
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              width: '95vw',
              height: '540px',
            }}
          >
            {/* <div
              style={{
                left: '-10px',
                top: '100px',
                position: 'absolute',
                width: '50px',
                height: '50px',
                backgroundColor: 'lightblue',
                zIndex: 1,
              }}
            ></div>
            <div
              style={{
                right: '-10px',
                top: '100px',
                position: 'absolute',
                width: '50px',
                height: '50px',
                backgroundColor: 'lightblue',
                zIndex: 1,
              }}
            ></div>
            <div
              style={{
                left: '-10px',
                bottom: '80px',
                position: 'absolute',
                width: '50px',
                height: '50px',
                backgroundColor: 'lightblue',
                zIndex: 1,
              }}
            ></div>
            <div
              style={{
                right: '-10px',
                bottom: '80px',
                position: 'absolute',
                width: '50px',
                height: '50px',
                backgroundColor: 'lightblue',
                zIndex: 1,
              }}
            ></div> */}

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
              }}
              // width={420}
              // height={540}
              // width={240}
              // height={540}
              onUserMediaError={(error) => alert(error)}
            />

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
              style={{ color: 'white', fontSize: '15px', fontWeight: 'bold' }}
            >
              영역 안에 운전면허증을 맞추고
              <br />
              선명하게 보일 때 하단 버튼을 눌러
              <br />
              촬영해 주세요.
            </div>
            <div style={{ paddingBottom: '20px' }}>
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
export default Test;
