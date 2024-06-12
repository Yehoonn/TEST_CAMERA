import React, { useEffect, useRef } from 'react';

// import { useMutation, useQuery } from '@apollo/client';
// import { GET, POST } from '../graphQL/graphQL';

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

const Test = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    async function getMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    }

    getMedia();
  }, []);

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>Camera Access</h1>
      <div
        style={{
          width: '600px',
          height: '400px',
          border: '1px solid black',
          margin: '0 auto',
        }}
      >
        <video ref={videoRef} width="100%" height="100%" autoPlay></video>
      </div>
    </div>
  );
};

export default Test;
