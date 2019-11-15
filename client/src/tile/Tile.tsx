import React from 'react';
import LocationTile from './LocationTile';

export type TileTypes = 'image-grid' | 'text' | 'location' | 'day';

export interface ITile<T = any> {
    type: TileTypes;
    timestamp: Date;
    content: T;
}

export interface TileProps {
  tile: ITile;
}

const Tile: React.FC<TileProps> = ({ tile }) => {
  let TileToDisplay: any;

  if (tile.type === 'location') {
    TileToDisplay = <LocationTile tile={tile}></LocationTile>
  }
  // TODO

  return (
    <TileToDisplay></TileToDisplay>
  );
}

export default Tile;