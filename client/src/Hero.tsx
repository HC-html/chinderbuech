import React from "react";
import styled from "styled-components";

const HeroContent = styled.header`
  width: 100%;
  background: url(sky.png);
  height: 400px;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  font-family: "Pacifico", serif;
  font-size: 32px;
  h1 {
    position: relative;
    z-index: 1;
    top: 32px;
    color: #860C19;
    background: white;
    border-radius: 32px;
    padding: 16px;
  }

  :after {
    content: "";
    display: block;
    width: 100%;
    height: 100px;
    background: url(/wave.png);
    position: absolute;
    bottom: 0;
    left: 0;
    background-size: 100% 100%;
    z-index: 0;
  }
`;

const Hero: React.FC = () => {
  return (
      <HeroContent>
        <h1>Chinderbuech</h1>
      </HeroContent>
  );
};

export default Hero;
