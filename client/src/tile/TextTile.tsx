import { ITile } from './Tile';
import React from "react";
import Card from '../shared/Card';


interface TextTileContent {
   text: string;
   title: string;
}

export type ITextTile = ITile<TextTileContent>;

export interface TextTileProps {
   tile: ITextTile;
}


const Text: React.FC<{ text: string }> = ({ text }) => {
   return (<span>{text}</span>);
}

const Title: React.FC<{ title: string }> = ({ title }) => {
   return (<h1>{title}</h1>);
}

const TextTile: React.FC<TextTileProps> = ({ tile }) => {
   return (
      <Card>
         <Title title={tile.content.title}></Title>
         <Text text={tile.content.text}></Text>
      </Card>
   );
};

export default TextTile;