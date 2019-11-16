import React from "react";
import { ITile } from "./Tile";
import styled from "styled-components";
import Card from "../shared/Card";
import { useHistory } from "react-router-dom";

type WeatherType = "sunny" | "thunderstorm" | "cloudy" | "fog" | "snow";
type DateTime = { $date: number };
interface DayTileContent {
  weather: WeatherType;
  date: DateTime;
  events: { name: string; start: DateTime; end: DateTime }[];
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

const StyledCard = styled(Card)`
  flex-grow: 1;
  margin: 8px;
`;

const Intro = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: 16px;
  @media only screen and (max-width: 1000px) {
    margin: 16px;
    flex-direction: column;
  }
`;

const WeatherIcon: React.FC<{ type: WeatherType }> = ({ type }) => {
  switch (type) {
    case "sunny":
      return <img width="100" alt={type} src="/weather/001-sunny.svg" />;
    case "cloudy":
    case "fog":
      return <img width="100" alt={type} src="/weather/002-cloudy.svg" />;
    case "snow":
      return <img width="100" alt={type} src="/weather/009-snow.svg" />;
    case "thunderstorm":
      return <img width="100" alt={type} src="/weather/007-thunder.svg" />;
    default:
      return <img width="100" alt={type} src="/weather/001-sunny.svg" />;
  }
};

const days = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag"
];

function formatDate(date: Date) {
  const day = date
    .getDate()
    .toString()
    .padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

const isToday = (someDate: Date) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

const DayTile: React.FC<LocationTileProps> = ({ tile }) => {
  let history = useHistory();
  console.log(history);
  const day = new Date(tile.content.date.$date);
  const date = formatDate(day);
  let dayName = days[day.getDay()];
  if (isToday(day)) {
    dayName = "Heute";
  }
  let t = tile as any;
  return (
    <DayTileContent>
      <button onClick={() => history.push((t.links.prev.href).replace('timeline/','').replace('?date=','/'))}>vorheriger Tag</button>
      <DayTileTitle>{dayName}</DayTileTitle>
      <button onClick={() => history.push((t.links.next.href).replace('timeline/','').replace('?date=','/'))}> nächster Tag</button>
      <DayTileLine></DayTileLine>
      <DayTileDate>{date}</DayTileDate>
      <WeatherIcon type={tile.content.weather}></WeatherIcon>
      <h1>Das wichtigste in Kürze</h1>
      <Intro>
        <StyledCard>
          <strong>Agenda</strong>
          <ul>
            {tile.content.events.map((event, index) => {
              return <li key={index}>{event.name}</li>;
            })}
          </ul>
        </StyledCard>
        <StyledCard>
          <strong>Agenda</strong>
          <ul>
            {tile.content.events.map((event, index) => {
              return <li key={index}>{event.name}</li>;
            })}
          </ul>
        </StyledCard>
        <StyledCard>
          <strong>Agenda</strong>
          <ul>
            {tile.content.events.map((event, index) => {
              return <li key={index}>{event.name}</li>;
            })}
          </ul>
        </StyledCard>
      </Intro>
    </DayTileContent>
  );
};

export default DayTile;
