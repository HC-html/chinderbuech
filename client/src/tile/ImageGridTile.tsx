import { ITile } from './Tile';
import React from "react";
import Card from '../shared/Card';
import { API_URL } from '../constants';
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

const MAX_IMAGES_COUNT = 6;

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
      showMore = (<div>Alle {imageData.length} anzeigen</div>)
   }
   return (
      <Card>
         <Pig imageData={imageDataToShow}>
         </Pig>
         {showMore}
      </Card>
   );
};

export default ImageGridTile;