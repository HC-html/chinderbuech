import { ITile } from './Tile';
import React from "react";
import { API_URL } from '../constants';
import styled from 'styled-components'
const Pig = require('react-pig').default;
interface ImageGridTileContent {
   images: ImageGridImage[]
}
interface ImageGridImage {
   url: string;
   aspectRatio: number
}


export type IImageGridTile = ITile<ImageGridTileContent>;

export interface ImageGridTileProps {
   tile: IImageGridTile;
}

const MAX_IMAGES_COUNT = 60;

const ShowMoreStyled = styled.div`
   width: 80px;
   text-align:center;
   float:right;
   z-index: 100;
   background-color:white;
   border-radius: 10px;
`

const ImageGridTile: React.FC<ImageGridTileProps> = ({ tile }) => {
   let imageData = tile.content.images.map((image, index) => {
      return {
         url: API_URL + image.url,
         id: index,
         aspectRatio: image.aspectRatio
      }
   });
   let doNotShowAllImages = imageData.length > MAX_IMAGES_COUNT;
   let imageDataToShow;
   if (doNotShowAllImages) {
      imageDataToShow = imageData.slice(0, MAX_IMAGES_COUNT);
   } else {
      imageDataToShow = imageData;
   }
   let showMore;
   if (doNotShowAllImages) {
      showMore = (<ShowMoreStyled><a>mehr</a></ShowMoreStyled>)
   }
   console.log(imageDataToShow);
   return (
      <div>
         <Pig imageData={imageDataToShow}>
         </Pig>
         {showMore}
      </div>
   );
};

export default ImageGridTile;