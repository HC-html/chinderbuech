import React from "react";
import LocationTile from "./LocationTile";
import DayTile from "./DayTile";
import TextTile from "./TextTile";
import styled from "styled-components";
import ImageGridTile from "./ImageGridTile";
import HeroTile from "./HeroTile";
import ScheduleTile from "./ScheduleTile";

export type TileTypes =
  | "image-grid"
  | "text"
  | "location"
  | "day"
  | "hero"
  | "schedule";

export interface ITile<T = any> {
  type: TileTypes;
  timestamp: Date;
  content: T;
}

export interface TileProps {
  tile: ITile;
}

const TileContent = styled.div<{ width?: "full" | "medium" }>`
  width: ${props =>
    props.width === "full"
      ? "100%"
      : props.width === "medium"
      ? "1200px"
      : "700px"};
  min-height: 50px;
  margin-bottom: 32px;
  @media only screen and (max-width: 1200px) {
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
        <TileContent width="medium">
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
    case "hero":
      return (
        <TileContent width="full">
          <HeroTile tile={tile}></HeroTile>
        </TileContent>
      );
    case "schedule":
      return (
        <TileContent>
          <ScheduleTile tile={tile}></ScheduleTile>
        </TileContent>
      );
    default:
      return <div></div>;
  }
};

export default Tile;
