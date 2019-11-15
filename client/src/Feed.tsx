import React from 'react';
import styled from 'styled-components';
import Tile, { ITile } from './tile/Tile';
import useAxios from 'axios-hooks';

const FeedMain = styled.main`
  width: 100%;
  display: flex;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
`;

interface ApiMetadata {
  count: number;
  total: number;
  posts: ITile[];
  _links:{
    self: string;
    next: string;
  }
}

const Feed: React.FC = () => {
  const [{ data, loading, error }] = useAxios<ApiMetadata>({url : 'timeline/dummy' });

  if(loading) return <div>loading..</div>
  if(error) return <div>On noo :(</div>

  return (
    <FeedMain>
      {data.posts.map((tile, index) => (
        <Tile tile={tile} key={index}></Tile>
      ))}
    </FeedMain>
  );
};

export default Feed;
