import React from 'react';
import { ITile } from './Tile';

interface LocationTileContent {

}

export type ILocationTile = ITile<LocationTileContent>;
export interface LocationTileProps {
  tile: ILocationTile;
}

const LocationTile: React.FC<LocationTileProps> = ({ tile }) => {
  return (
    <h1></h1>
  )
}

export default LocationTile;
