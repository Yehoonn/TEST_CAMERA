// @types/react-camera-ios/index.d.ts
declare module 'react-camera-ios' {
  import { ComponentType } from 'react';

  interface CameraProps {
    ref: any;
    isFullscreen?: boolean;
    hasAudio?: boolean;
    onCapture?: (data: { uri: string }) => void;
    onError?: (error: Error) => void;
    facingMode?: 'user' | 'environment';
    device: any;
    placement: any;
    quality?: any;
    // onTakePhoto: any;
    // 필요한 다른 props도 여기에 추가할 수 있습니다.
  }

  const Camera: ComponentType<CameraProps>;

  export default Camera;
}
