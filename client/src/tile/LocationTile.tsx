import React from "react";
import { ITile } from "./Tile";
import Card from "../shared/Card";

interface LocationTileContent {}

export type ILocationTile = ITile<LocationTileContent>;
export interface LocationTileProps {
  tile: ILocationTile;
}

const LocationTile: React.FC<LocationTileProps> = ({ tile }) => {
  return (
    <Card>
      <h1>Asdf</h1>
    </Card>
  );
};

export default LocationTile;
