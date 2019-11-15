import React from "react";
import { ITile } from "./Tile";
import Postcard from "../shared/Postcard";

interface LocationTileContent {
  longitude: number;
  latitude: number;
  text: string;
}

export type ILocationTile = ITile<LocationTileContent>;
export interface LocationTileProps {
  tile: ILocationTile;
}

const LocationTile: React.FC<LocationTileProps> = ({ tile }) => {
  return (
    <Postcard
      latitude={tile.content.latitude}
      longitude={tile.content.longitude}
      text={tile.content.text}
    ></Postcard>
  );
};

export default LocationTile;
