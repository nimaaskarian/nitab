import styled from "styled-components";
import { CloseButton } from "components/SideMenu/style";
import { DeleteButton } from "components/SideMenu/components/styled";
export const ThemeBackground = styled.div`
  box-sizing: border-box;
  background: ${({ background }) => background};
  width: 100%;
  min-height: 200px;
  filter: ${({ blur, brightness }) =>
    `blur(${blur}px) brightness(${brightness || 1})`};
  background-position-x: center !important;
  background-position-y: center !important;
  background-size: cover !important;
`;
export const StyledDeleteButton = styled(DeleteButton)`
  margin-left: 0;
  font-size: 18px;
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 5;
`;

export const Theme = styled.div`
  position: relative;
  margin: 5px 0;
  user-select: none;
  cursor: pointer;
  border: ${({ isCurrent }) => isCurrent && "solid 2px white"};
  transition: border 0.05s linear;
  border-radius: 5px;
`;
export const ClockWrapper = styled.div`
  & > * {
    ${({ position }) => {
      return `
    position: ${position !== "center" && "absolute"};
    top: ${position !== "center" && "10px"};
    ${position}: 5%;
    `;
    }}
    align-items: ${({ align }) => align};
  }

  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  &,
  & * {
    color: ${({ color }) => color};
  }
  justify-content: center;
  align-items: center;

  display: flex;
  font-family: ${({ font }) => font};
`;
