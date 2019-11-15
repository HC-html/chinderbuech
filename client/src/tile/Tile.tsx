import React from "react";
import LocationTile from "./LocationTile";
import DayTile from "./DayTile";
import TextTile from './TextTile';
import styled from 'styled-components';

export type TileTypes = "image-grid" | "text" | "location" | "day";

export interface ITile<T = any> {
  type: TileTypes;
  timestamp: Date;
  content: T;
}

export interface TileProps {
  tile: ITile;
}

const TileContent = styled.div`
  width: 700px;
  min-height: 50px;
  margin-bottom: 32px;
`;

function getTile(tile: ITile): JSX.Element {
  switch (tile.type) {
    case "location":
      return <LocationTile tile={tile}></LocationTile>;
    case "day":
      return <DayTile tile={tile}></DayTile>;
    case "text":
      return <TextTile tile={tile}></TextTile>
    default:
      return <div></div>;
  }
}

const Tile: React.FC<TileProps> = ({ tile }) => {
  return <TileContent>{getTile(tile)}</TileContent>;
};

export default Tile;
