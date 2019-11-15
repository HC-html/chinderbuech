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
  @media only screen and (max-width: 800px) {
    width: calc(100% - 32px);
    padding: 16px;
  }
`;

interface ApiMetadata {
  count: number;
  total: number;
  timeline: ITile[];
  _links: {
    self: {
      href: string;
    },
    next:
    {
      href: string;
    }
  }
}

const Feed: React.FC = () => {
  const [{ data, loading, error }] = useAxios<ApiMetadata>({ url: 'timeline' });

  if (loading) return <div>loading..</div>
  if (error) return <div>On noo :(</div>
  return (
    <FeedMain>
      {data.timeline.map((tile, index) => (
        <Tile tile={tile} key={index}></Tile>
      ))}
    </FeedMain>
  );
};

export default Feed;
