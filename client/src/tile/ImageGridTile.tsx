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
}


export type IImageGridTile = ITile<ImageGridTileContent>;

export interface ImageGridTileProps {
   tile: IImageGridTile;
}


const ImageGridTile: React.FC<ImageGridTileProps> = ({ tile }) => {
   let imageData = tile.content.images.map(image=>{
      return {
         url: API_URL+image.url,
         aspectRatio: 0.5
      }
   })
   return (
      <Card>
         <Pig imageData={imageData}>
         </Pig>
      </Card>
   );
};

export default ImageGridTile;