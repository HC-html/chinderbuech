import React from "react";
import styled from "styled-components";
import Tile, { ITile } from "./tile/Tile";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";

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
    self: {
      href: string;
    };
    next: {
      href: string;
    };
  };
}

const Feed: React.FC = () => {
  const { user } = useParams();
  const [{ data, loading, error }] = useAxios<ApiMetadata>({
    url: `timeline/${user || ""}`
  });
  if (loading)
    return (
      <Loading>
        <span>Loading...</span>
        <img src="./children.svg" alt="Children" />
      </Loading>
    );
  if (error)
    return (
      <Loading>
        <span>Something went wrong :(</span>
        <small>Just like your children</small>
        <img src="./children.svg" alt="Children" />
      </Loading>
    );
  return (
    <FeedMain>
      {data.timeline.map((tile, index) => (
        <Tile tile={tile} key={index}></Tile>
      ))}
    </FeedMain>
  );
};

export default Feed;
