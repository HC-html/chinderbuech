
import axios from 'axios'
import React from "react";
import Postcard from '../shared/Postcard';
import { AXIOS_CONFIG } from '../constants';
import styled from "styled-components";

let usePosition = require('use-position').usePosition;

const LocationWrapper = styled.div`
width:80%;
`

function shareLocation(latitude: number, longitude: number): any {
   axios.post('posts/location', { latitude, longitude }, AXIOS_CONFIG);
}

const Location: React.FC<void> = ({ }) => {
   const { latitude, longitude} = usePosition(true);
   if (latitude && longitude) {

      return (
         <LocationWrapper>
            <Postcard longitude={longitude} latitude={latitude} text=''></Postcard>
            <button onClick={() => shareLocation(latitude, longitude)}>share</button>
         </LocationWrapper>
      );
   }
   else return <div>loading</div>
};

export default Location;