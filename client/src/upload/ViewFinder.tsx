import React, { Component } from 'react';
import { Button } from 'react-native';
import 'react-html5-camera-photo/build/css/index.css';
import axios from 'axios'
import { AXIOS_CONFIG } from '../constants';
import styled from 'styled-components';

let cam = require("react-html5-camera-photo");
let Camera = cam.Camera;
let FACING_MODES = cam.FACING_MODES;
let IMAGE_TYPES = cam.IMAGE_TYPES;
const RES_HIGH = 1280;
const RES_LOW = 720;
const CameraDiv = styled.div`
   /* width: 100px; */
   position: absolute;
   bottom: 0px;
`

const ControlsRight = styled.div`
   
   width: 20%;
   position: absolute;
   bottom: 16px;
   left:10px;
   color: blue;
   z-index: 999999999999999;
`;

const ControlsLeft = styled.div`
   background-color:white;
   width: 20%;
   position: absolute;
   bottom: 16px;
   right: 10px;
   color: blue;
   z-index: 999999999999999;
`;

class ViewFinder extends Component {
   onTakePhoto(dataUri: any) {
      let file = this.dataURLtoFile(dataUri, 'file.jpg');
      let fd = new FormData();
      fd.append('file', file);
      let customConfig = JSON.parse(JSON.stringify(AXIOS_CONFIG))
      customConfig.headers['Content-Type'] = 'multipart/form-data';
      axios.post('posts/image', fd, customConfig);
   }
   dataURLtoFile(dataurl: string, filename: string) {
      let arr: any = dataurl.split(','),
         mime = arr[0].match(/:(.*?);/)[1],
         bstr = atob(arr[1]),
         n = bstr.length,
         u8arr = new Uint8Array(n);
      while (n--) {
         u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
   };
   render() {
      let height, width;
      console.log(window.innerHeight, window.innerWidth)
      if (window.innerWidth > window.innerHeight) {
         height = RES_LOW;
         width = RES_HIGH;
      } else {
         height = RES_HIGH;
         width = RES_LOW;
      }
      console.log(height, width);
      return (
         <CameraDiv>
            <ControlsRight>
<button>Location</button>
            </ControlsRight>
            <ControlsLeft>
               <button>Text</button>
            </ControlsLeft>
            <Camera
               onTakePhoto={(dataUri: any) => { this.onTakePhoto(dataUri); }}
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
   }
}


export default ViewFinder