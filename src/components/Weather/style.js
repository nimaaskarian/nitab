import styled, { keyframes } from "styled-components";
import Tippy from "@tippyjs/react";

const rotate = keyframes`
from{
  transform: rotate(0);
}
to{
  transform: rotate(360deg);
}
`;

export const WeatherSelector = styled.div`
  display: inline-block;
  margin-right: 5px;
  cursor: pointer;
  max-height: 200px;
  overflow-y: scroll;
  & > * {
    display: inline-block;
  }
`;
export const WeatherWrapper = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 24px;
  margin-top: auto;
  margin-bottom: auto;
  margin-top: 12px;
`;
export const WeatherLoading = styled.div`
  & > i {
    animation: ${rotate} 1s ease-in-out infinite;
    font-size: 18px;
  }
`;

export const StyledTippy = styled(Tippy)`
  z-index: 10;
  font-family: ${({ font }) => font};
`;
