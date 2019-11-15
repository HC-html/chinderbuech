import { ITile } from './Tile';
import React from "react";
import Card from '../shared/Card';
import { API_URL } from '../constants';

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


const Image: React.FC<{ url: string }> = ({ url }) => {
   return (<img src={url}></img>);
}


const ImageGridTile: React.FC<ImageGridTileProps> = ({ tile }) => {
   return (
      <Card>
         {tile.content.images.map((image, index) => (
            <Image url={API_URL+image.url} key={index}></Image>
         ))}
      </Card>
   );
};

export default ImageGridTile;