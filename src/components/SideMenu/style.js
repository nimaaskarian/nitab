import styled from "styled-components";
import { TwoConditionElement } from "./components/styled";

export const StyledSideMenu = styled.div`
  & label,
  & input,
  button {
    color: #e2e2e2;
  }
  & label::selection,
  & input::selection {
    background-color: #e2e2e2;
  }
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  /* left: 0; */
  box-sizing: border-box;
  max-width: 400px;
  width: 100vw;
  background-color: rgba(22, 22, 22, 0.75);
  color: white;
  padding: 20px;
  transform: ${({ enabled }) => `translateX(${enabled ? "0" : "-400px"})`};
  transition: transform 450ms cubic-bezier(0.65, 0.05, 0.36, 1);
  font-family: ${({ font }) => font || "VazirCodeHack"};
  border-radius: 0px 10px 10px 0px;
`;
export const SideMenuWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  position: absolute;
  z-index: 5;
  pointer-events: ${({ enabled }) => !enabled && "none"};
`;
export const ContentWrapper = styled.div`
  max-height: 100%;
  overflow: scroll;
`;
export const CloseButton = styled.button`
  color: #e2e2e2;
  background: transparent;
  outline: none;
  border: none;
  box-shadow: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;
export const StyledNavbar = styled.div`
  &,
  & * {
    color: inherit;
  }
  gap: 5px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  box-sizing: border-box;
  width: 100%;
`;

export const StyledNavItem = styled(TwoConditionElement)`
  user-select: none;
  cursor: pointer;
`;
