import { ITile } from './Tile';
import React from "react";


interface TextTileContent {
   text: string;
}

export type ITextTile = ITile<TextTileContent>;

export interface TextTileProps {
   tile: ITextTile;
}


const Text: React.FC<{ text: string }> = ({ text }) => {
   return (<span>{text}</span>)
}

const TextTile: React.FC<TextTileProps> = ({ tile }) => {
   return (<Text text={tile.content.text}></Text>);
};

export default TextTile;