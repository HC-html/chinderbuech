
import axios from 'axios'
import React from "react";
import Postcard from '../shared/Postcard';
import { AXIOS_CONFIG } from '../constants';
import styled from "styled-components";
import Fab from '@material-ui/core/Fab'
import MyLocationIcon from '@material-ui/icons/MyLocation';
// import NavigationIcon from '@material-ui/core'

let usePosition = require('use-position').usePosition;


const StyledFap = styled(Fab)`
margin:10px;
`

const Content = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center;
   padding: 16px;
`;



const Location: React.FC<void> = () => {

   function shareLocation(latitude: number, longitude: number): any {
      axios.post('posts/location', { latitude, longitude }, AXIOS_CONFIG);
   
   }

   const { latitude, longitude } = usePosition(true);
   if (latitude && longitude) {
      return (
         <Content>
            <Postcard longitude={longitude} latitude={latitude} text=''></Postcard>
            <StyledFap variant="extended" aria-label="like" onClick={() => shareLocation(latitude, longitude)}>
               <MyLocationIcon ></MyLocationIcon>
                Standort teilen
               </StyledFap>
         </Content>
      );
   }
   else return <div>loading</div>
};

export default Location;