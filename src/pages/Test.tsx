import React, { useEffect, useRef, useState } from 'react';

// import { useMutation, useQuery } from '@apollo/client';
// import { GET, POST } from '../graphQL/graphQL';

const Test = () => {
  // const [addHuman] = useMutation(POST.createHuman);
  // const { loading, error, data, refetch } = useQuery(GET.humans);

  // const [input, setInput] = useState({
  //   age: 1,
  //   name: '',
  // });

  // const postData = async () => {
  //   try {
  //     // 뮤테이션 실행
  //     const { data } = await addHuman({
  //       variables: { name: input.name, age: input.age },
  //     });
  //     console.log(data);
  //   } catch (error) {
  //     console.error('Error : ', error);
  //   }
  // };

  // const refresh = () => {
  //   refetch();
  // };

  // console.log(data);

  // return (
  //   <div>
  //     {/* <div onClick={setToken}>발급</div>
  // <div onClick={verifyToken}>검증</div> */}
  //     <input
  //       placeholder="age"
  //       type="number"
  //       value={input.age}
  //       onChange={(e) => {
  //         setInput({ ...input, age: Number(e.target.value) });
  //       }}
  //     ></input>
  //     <input
  //       placeholder="name"
  //       type="string"
  //       value={input.name}
  //       onChange={(e) => {
  //         setInput({ ...input, name: e.target.value });
  //       }}
  //     ></input>
  //     <div onClick={postData}>데이터 생성</div>
  //     <div onClick={refresh}>데이터 가져오기</div>
  //     <div>
  //       {data?.humans?.map((value: any, index: any) => {
  //         return <div key={index}>{value.age}</div>;
  //       })}
  //     </div>
  //   </div>
  // );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = isCameraOn ? stream : null;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initCamera();

    return () => {
      // 컴포넌트가 언마운트되면 미디어 스트림 해제
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  const toggleCamera = () => {
    setIsCameraOn((prevState) => !prevState);
  };

  return (
    <div>
      <button onClick={toggleCamera}>
        {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default Test;
