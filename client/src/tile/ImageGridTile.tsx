import { ITile } from './Tile';
import React from "react";
import Card from '../shared/Card';
import { API_URL } from '../constants';
import styled from "styled-components";
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

const MAX_IMAGES_COUNT = 4;

const showMoreStyled = styled.div`
   margin-top: -100px;
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
   // if (doNotShowAllImages) {
   //    showMore = (<showMoreStyled><Card><div>Alle {imageData.length} anzeigen</div></Card></showMoreStyled>)
   // }

   return (
      <div>
         <Pig imageData={imageDataToShow}>
         </Pig>
         {showMore}
      </div>
   );
};

export default ImageGridTile;