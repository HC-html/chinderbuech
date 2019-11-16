
import styled from "styled-components";

const Card = styled.div<{ noPadding?: boolean }>`
  background: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: ${props => ((props as any).noPadding ? "0px" : "16px")};
`;

export default Card;
