import { ITile } from "./Tile";
import React from "react";
import { API_URL } from "../constants";
import styled from "styled-components";
import useWindowSize from "../shared/useWindowSize";

interface HeroTileContent {
  title: string;
  image: {
    url: string;
    aspectRatio: number;
  };
}

export type IHeroTile = ITile<HeroTileContent>;

export interface HeroTileProps {
  tile: IHeroTile;
}

const HeroTileContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  h2 {
    font-size: 64px;
    @media only screen and (max-width: 800px) { 
      font-size: 32px;
    }
  }
`;

const HeroTile: React.FC<HeroTileProps> = ({ tile }) => {
  const url = API_URL + tile.content.image.url;
  const size = useWindowSize();
  let height = 800;
  let width = height * tile.content.image.aspectRatio;

  if (size.width - 64 < width) {
    height = (size.width - 64) / tile.content.image.aspectRatio;
    width = size.width - 64;
  }
  return (
    <HeroTileContent>
      <h2>{tile.content.title}</h2>
      <img alt={tile.content.title} src={url} width={width} height={height} />
    </HeroTileContent>
  );
};

export default HeroTile;
