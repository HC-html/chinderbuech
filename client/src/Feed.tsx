import React from 'react';
import styled from 'styled-components';
import Tile, { ITile } from './tile/Tile';
import useAxios from 'axios-hooks';

const FeedMain = styled.main`
  width: 100%;
  display: flex;
`;

const Feed: React.FC = () => {
  const tiles: ITile[] = [{
    type: 'location',
    content: {},
    timestamp: new Date(),
  }]
  const [{ data, loading, error }, refetch] = useAxios({url : 'timeline/dummy' });
  console.log(data);
  return (
    <FeedMain>
      {tiles.map((tile, index) => <Tile tile={tile} key={index}></Tile>)}
    </FeedMain>
  );
}

export default Feed;
