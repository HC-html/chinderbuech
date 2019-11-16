import React from "react";
import styled from "styled-components";
import Tile, { ITile } from "./tile/Tile";
import useAxios from "axios-hooks";
import Hero from "./Hero";
import { ITextTile } from "./tile/TextTile";

const FeedMain = styled.main`
  width: 100%;
  display: flex;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  @media only screen and (max-width: 800px) {
    width: calc(100% - 32px);
    padding: 16px;
  }
`;

const Loading = styled.main`
  width: 100%;
  min-height: calc(100vh - 300px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #616161;
  font-weight: 200;
  text-shadow: 2px 2px rgba(255, 255, 255, 0.8);
  span {
    font-size: 48px;
    @media only screen and (max-width: 800px) {
      font-size: 32px;
    }
  }
  small {
    font-size: 24px;
    margin-bottom: 48px;
  }
  img {
    width: 30%;
    max-width: 700px;
  }
`;

interface ApiMetadata {
  count: number;
  total: number;
  timeline: ITile[];
  _links: {
    prev: {
      href: string;
    };
    next: {
      href: string;
    };
  };
}

const Feed: React.FC<any> = ({ match }) => {
  const [{ data, loading, error }] = useAxios<ApiMetadata>({
    url: `timeline/${match.params.user || ""}/?date=${match.params.date || ""}`
  });
  if (loading)
    return (
      <>
        <Hero></Hero>
        <Loading>
          <span>Loading...</span>
          <img src="./children.svg" alt="Children" />
        </Loading>
      </>
    );
  if (error)
    return (
      <>
        <Hero></Hero>
        <Loading>
          <span>Something went wrong :(</span>
          <small>Just like your children</small>
          <img src="./children.svg" alt="Children" />
        </Loading>
      </>
    );

  if (data.timeline.length === 0) {
    data.timeline.push({
      type: "text",
      timestamp: new Date(),
      content: {
        text: "sorry",
        title: "Nix Kita dise Tag",
      }
    } as ITextTile)
  }
  return (
    <>
      <Hero></Hero>
      <FeedMain>
        {data.timeline.map((tile, index) => {
          let t = tile as any;
          t.links = data._links;
          return (<Tile tile={tile} key={index}></Tile>)
        }
        )}
      </FeedMain>
    </>
  );
};

export default Feed;
