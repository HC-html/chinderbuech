import React from "react";
import { ITile } from "./Tile";
import styled from "styled-components";

interface DayTileContent {
  weather: string;
  date: string;
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
  font-weight: 300;
  color: #616161;
  text-shadow: 2px 2px rgba(255, 255, 255, 0.8);
`;

const DayTileTitle = styled.h2`
  font-weight: 300;
  font-size: 32px;
`;

const DayTileDate = styled.small`
  font-size: 18px;
  background: #eeeeee;
  padding: 0 32px;
  position: relative;
  top: -23px;
  z-index: 1;
`;

const DayTileLine = styled.hr`
  display: block;
  width: 100%;
  height: 1px;
  background: #eeeeee;
  position: relative;
  z-index: 1;
  border: 0;
  box-shadow: inset 0px 1px 1px #909193, 0px 1px 0px #fff;
  outline: 0;
`;

const WeatherIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "sunny":
      return <img width="100" alt={type} src="/weather/001-sunny.svg" />;
    case "cloudy":
      return <img width="100" alt={type} src="/weather/002-cloudy.svg" />;
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
      <WeatherIcon type={tile.content.weather}></WeatherIcon>
    </DayTileContent>
  );
};

export default DayTile;
