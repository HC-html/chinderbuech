import React from "react";
import "react-html5-camera-photo/build/css/index.css";
import axios from "axios";
import { AXIOS_CONFIG } from "../constants";
import styled from "styled-components";

let cam = require("react-html5-camera-photo");

const CameraDiv = styled.div`
  position: relative;
`;

const ViewFinder: React.FC = () => {
  const Camera = cam.Camera;
  const FACING_MODES = cam.FACING_MODES;
  const IMAGE_TYPES = cam.IMAGE_TYPES;

  const onTakePhoto = (dataUri: any) => {
    let file = dataURLtoFile(dataUri, "file.jpg");
    let fd = new FormData();
    fd.append("file", file);
    let customConfig = { ...AXIOS_CONFIG } as any;
    customConfig.headers["Content-Type"] = "multipart/form-data";
    axios.post("posts/image", fd, customConfig).then(() => {
      alert("Bild hochgeladen!");
    });
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    let arr: any = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <CameraDiv>
      <Camera
        onTakePhoto={onTakePhoto}
        idealFacingMode={FACING_MODES.USER}
        imageType={IMAGE_TYPES.JPG}
        // idealResolution={{ width, height }}
        imageCompression={0.97}
        isMaxResolution={false}
        isImageMirror={false}
        isSilentMode={false}
        isDisplayStartCameraError={true}
        isFullscreen={false}
        sizeFactor={1}
      />
    </CameraDiv>
  );
};
export default ViewFinder;
