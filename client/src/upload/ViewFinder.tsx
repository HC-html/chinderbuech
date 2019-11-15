import React, { Component } from 'react';
import { Button } from 'react-native';
import 'react-html5-camera-photo/build/css/index.css';
import axios from 'axios'
import { AXIOS_CONFIG } from '../constants';
let cam = require("react-html5-camera-photo");
let Camera = cam.Camera;
let FACING_MODES = cam.FACING_MODES;
let IMAGE_TYPES = cam.IMAGE_TYPES;

class ViewFinder extends Component {
   onTakePhoto(dataUri: any) {
      let file = this.dataURLtoFile(dataUri, 'file');
      let fd = new FormData();
      fd.append('file', file);
      let customConfig = JSON.parse(JSON.stringify(AXIOS_CONFIG))
      customConfig.headers['Content-Type']= 'multipart/form-data';
      axios.post('posts/image', fd, customConfig);
   }
   dataURLtoFile(dataurl:string, filename:string) {
      let arr:any = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
    };
   render() {
      return (
         <div>
            <Camera
               onTakePhoto={(dataUri: any) => { this.onTakePhoto(dataUri); }}
               idealFacingMode={FACING_MODES.ENVIRONMENT}
               idealResolution={{ width: 640, height: 480 }}
               imageType={IMAGE_TYPES.JPG}
               imageCompression={0.97}
               isMaxResolution={true}
               isImageMirror={false}
               isSilentMode={false}
               isDisplayStartCameraError={true}
               isFullscreen={false}
               sizeFactor={1}
            />
         </div>
      );
   }
}


export default ViewFinder