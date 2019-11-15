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
  opacity: 0.6;
`;

const DayTileTitle = styled.h2`
  font-weight: 200;
  font-size: 32px;
`;

const DayTileDate = styled.small`
  font-style: italic;
  font-size: 18px;
  background: #f6f9fc;
  padding: 0 32px;
  position: relative;
  top: -23px;
  z-index: 1;
`;

const DayTileLine = styled.hr`
  display: block;
  width: 100%;
  height: 2px;
  background: #a09e9e;
  position: relative;
  z-index: 1;
  border: 0;
  outline: 0;
`;

const WeatherIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "sunny":
      return <img width="100" alt={type} src="/weather/001-sunny.svg" />;
    default:
      return <img width="100" alt={type} src="/weather/001-sunny.svg" />;
  }
};

const DayTile: React.FC<LocationTileProps> = ({ tile }) => {
  return (
    <DayTileContent>
      <DayTileTitle>Mittwoch</DayTileTitle>
      <DayTileLine></DayTileLine>
      <DayTileDate>15.11.2019</DayTileDate>
      <WeatherIcon type={tile.content.weatherType}></WeatherIcon>
    </DayTileContent>
  );
};

export default DayTile;
