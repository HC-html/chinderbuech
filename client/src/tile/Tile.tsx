import React from "react";
import LocationTile from "./LocationTile";

export type TileTypes = "image-grid" | "text" | "location" | "day";

export interface ITile<T = any> {
  type: TileTypes;
  timestamp: Date;
  content: T;
}

export interface TileProps {
  tile: ITile;
}

function getTile(tile: ITile): JSX.Element {
  switch (tile.type) {
    case "location":
      return <LocationTile tile={tile}></LocationTile>;
    default:
      return <div></div>;
  }
}

const Tile: React.FC<TileProps> = ({ tile }) => {
  return <div>{getTile(tile)}</div>;
};

export default Tile;
