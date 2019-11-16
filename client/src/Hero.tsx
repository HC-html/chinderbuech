import React from "react";
import styled from "styled-components";

const HeroContent = styled.header`
  width: 100%;
  background: #6C63FF;
  height: 300px;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  font-family: "Pacifico", serif;
  font-size: 32px;
  @media only screen and (max-width: 800px) {
    height: 200px;
    font-size: 24px;
  }
  h1 {
    position: relative;
    z-index: 1;
    top: 16px;
    color: #E1E1F0;
    @media only screen and (max-width: 800px) {
      top: 0px;
    }
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
    @media only screen and (max-width: 800px) {
      background-size: 200% 100%;
      background-position: center;
      height: 50px;
    }
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
