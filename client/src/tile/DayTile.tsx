import React from "react";
import { ITile } from "./Tile";
import styled from "styled-components";

interface DayTileContent {
  weatherType: string;
}

export type IDayTile = ITile<DayTileContent>;
export interface LocationTileProps {
  tile: IDayTile;
}

const DayTileContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  opacity: 0.7;
`;

const DayTileTitle = styled.h2`
  font-weight: 200;
  font-size: 32px;
`;

const WeatherIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "sunny":
      return <img width="100" alt={type} src="/weather/001-sunny.svg" />;
    default:
      return <div></div>;
  }
};

const DayTile: React.FC<LocationTileProps> = ({ tile }) => {
  return (
    <DayTileContent>
      <DayTileTitle>Mittwoch</DayTileTitle>
      <WeatherIcon type={tile.content.weatherType}></WeatherIcon>
    </DayTileContent>
  );
};

export default DayTile;
