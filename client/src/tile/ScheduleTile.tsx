import { ITile } from "./Tile";
import React from "react";
import styled from "styled-components";

interface ScheduleTileContent {
  event: string;
}

export type IScheduleTile = ITile<ScheduleTileContent>;

export interface ScheduleTileProps {
  tile: IScheduleTile;
}

const ScheduleContent = styled.div`
  opacity: 0.8;
  font-weight: 400;
  color: #616161;
  text-shadow: 2px 2px rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const ScheduleTileEvent = styled.small`
  font-size: 18px;
  background: #eeeeee;
  padding: 0 32px;
  position: relative;
  top: -23px;
  z-index: 1;
`;

const ScheduleTileLine = styled.hr`
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

const ScheduleTile: React.FC<ScheduleTileProps> = ({ tile }) => {
  return (
    <ScheduleContent>
      <ScheduleTileLine></ScheduleTileLine>
      <ScheduleTileEvent>{tile.content.event}</ScheduleTileEvent>
    </ScheduleContent>
  );
};

export default ScheduleTile;
