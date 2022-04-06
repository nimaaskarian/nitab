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
export const CityNameWrapper = styled.span`
  cursor: pointer;
  margin-right: 15px;
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
    animation: ${rotate} 0.7s ease-in-out infinite;
    font-size: 22px;
  }
  cursor: pointer;
`;

export const StyledTippy = styled(Tippy)`
  font-size: 16px;
  z-index: 10;
  font-family: ${({ font }) => font};
`;
