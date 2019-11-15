import React from "react";
import LocationTile from "./LocationTile";
import DayTile from "./DayTile";
import TextTile from "./TextTile";
import styled from "styled-components";
import ImageGridTile from "./ImageGridTile";

export type TileTypes = "image-grid" | "text" | "location" | "day";

export interface ITile<T = any> {
  type: TileTypes;
  timestamp: Date;
  content: T;
}

export interface TileProps {
  tile: ITile;
}

const TileContent = styled.div<{ fullWidth?: boolean }>`
  width: ${props => (props.fullWidth ? "100%" : "700px")};
  min-height: 50px;
  margin-bottom: 32px;
  @media only screen and (max-width: 800px) {
    width: 100%;
  }
`;

const Tile: React.FC<TileProps> = ({ tile }) => {
  switch (tile.type) {
    case "location":
      return (
        <TileContent>
          <LocationTile tile={tile}></LocationTile>
        </TileContent>
      );
    case "day":
      return (
        <TileContent>
          <DayTile tile={tile}></DayTile>
        </TileContent>
      );
    case "text":
      return (
        <TileContent>
          <TextTile tile={tile}></TextTile>
        </TileContent>
      );
    case "image-grid":
      return (
        <TileContent>
          <ImageGridTile tile={tile}></ImageGridTile>
        </TileContent>
      );
    default:
      return <div></div>;
  }
};

export default Tile;
