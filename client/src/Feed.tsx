import React, { useState } from "react";
import styled from "styled-components";
import Tile, { ITile } from "./tile/Tile";
import useAxios from "axios-hooks";
import Hero from "./Hero";
import { ITextTile } from './tile/TextTile';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import PhotoIcon from "@material-ui/icons/Photo";
import CreateIcon from "@material-ui/icons/Create";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
import ArrowBackLosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { IDayTile } from './tile/DayTile';

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

const DaySelect = styled.div`
  width: 700px;
  display: flex;
  position: relative;
  top: 70px;
  z-index: 3;
  @media only screen and (max-width: 800px) {
    width: 100%;
    .text {
      display: none;
    }
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
const Controls = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
`;

const Feed: React.FC<any> = ({ match }) => {
  let history = useHistory();
  const [{ data, loading, error }] = useAxios<ApiMetadata>({
    url: `timeline/${match.params.user || ""}/?date=${match.params.date || ""}`
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any, index?: any) => {
    setAnchorEl(event.currentTarget);
  };

  const go = (goto: string) => {
    history.push(goto);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading)
    return (
      <>
        <Hero></Hero>
        <Loading>
          <span>Loading...</span>
          <img src="/children.svg" alt="Children" />
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
          <img src="/children.svg" alt="Children" />
        </Loading>
      </>
    );
  let additionalinfo = (<></>);
  if (data.timeline.length === 0) {
    try {

      data.timeline.push({ timestamp: new Date(match.params.date), type: "day", content: { date: { $date: new Date(match.params.date).getTime() }, weather: "cloudy", events: [], children: [] } } as IDayTile);
      data.timeline.push({ timestamp: new Date(match.params.date), type: "text", content: { title: 'Kein Tagebucheintrag gefunden ...' } } as ITextTile);
    } catch (e) { }
    additionalinfo = (<Loading><img src="/no-dairy.svg" alt="Children" /></Loading>);
  }
  return (
    <>
      <Hero></Hero>
      <FeedMain>
        <DaySelect>
          <Button
            onClick={() =>
              go(
                data._links.prev.href
                  .replace("timeline/", "")
                  .replace("?date=", "/")
              )
            }
          >
            <ArrowBackLosIcon />
            <span className="text">vorheriger Tag</span>
          </Button>
          <span style={{ flexGrow: 1 }}></span>
          <Button
            onClick={() =>
              go(
                data._links.next.href
                  .replace("timeline/", "")
                  .replace("?date=", "/")
              )
            }
          >
            {" "}
            <span className="text">nächster Tag</span>
            <ArrowForwardIosIcon />
          </Button>
        </DaySelect>
        {data.timeline.map((tile, index) => {
          return <Tile tile={tile} key={index}></Tile>;
        })}
      </FeedMain>
      <Controls>
        <Fab color="primary" aria-label="add" onClick={handleClick}>
          <AddIcon />
        </Fab>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => go("/photo")}>
            <PhotoIcon />
            &nbsp;Photo
          </MenuItem>
          <MenuItem onClick={() => go("/location")}>
            <MyLocationIcon />
            &nbsp;Ortschaft
          </MenuItem>
          <MenuItem onClick={() => go("/text")}>
            <CreateIcon />
            &nbsp;Text
          </MenuItem>
        </Menu>
      </Controls>
      {additionalinfo}
    </>
  );
};

export default Feed;
