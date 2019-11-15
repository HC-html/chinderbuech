import React from "react";
import { ITile } from "./Tile";
import { Map, Marker, TileLayer } from "react-leaflet";
import styled from "styled-components";
import L from "leaflet";

interface LocationTileContent {
  longitude: number;
  latitude: number;
}

export type ILocationTile = ITile<LocationTileContent>;
export interface LocationTileProps {
  tile: ILocationTile;
}

const CardMapContainer = styled.div`
  width: 100%;
  height: 400px;
  display: inline-block;
  padding: 10px;
  background: white;
  position: relative;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.19));
  background: radial-gradient(
    transparent 0px,
    transparent 4px,
    white 4px,
    white
  );
  background-size: 20px 20px;
  background-position: -10px -10px;
  transform: rotate(${Math.random() * (4 - -4) + -4}deg);

  :after {
    content: "";
    position: absolute;
    left: 5px;
    top: 5px;
    right: 5px;
    bottom: 5px;
    z-index: -1;
  }
`;

const CardMapContainerText = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  font-size: 48px;
  transform: rotate(-3deg);
  color: #344360;
  text-shadow: 2px 2px white;
  line-height: 100%;
  padding: 20px;
  z-index: 99999;
  font-family: "Pacifico", cursive;
`;

const LeaftletMap = styled(Map)`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const pointerIcon = new L.Icon({
  iconUrl: './pin.png',
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [39, 55],
  shadowUrl: './marker-shadow.png',
  shadowSize: [68, 95],
  shadowAnchor: [25, 92],
});

const LocationTile: React.FC<LocationTileProps> = ({ tile }) => {
  const position = [tile.content.latitude, tile.content.longitude] as any;
  return (
    <CardMapContainer className="stamp">
      <CardMapContainerText>Greetings from Bern</CardMapContainerText>
      <LeaftletMap
        zoomControl={false}
        touchZoom={false}
        scrollWheelZoom={false}
        dragging={false}
        boxZoom={false}
        center={position}
        doubleClickZoom={false}
        keyboard={false}
        zoom={16}
      >
        <TileLayer url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png" />
        <Marker position={position} icon={pointerIcon}></Marker>
      </LeaftletMap>
    </CardMapContainer>
  );
};

export default LocationTile;
