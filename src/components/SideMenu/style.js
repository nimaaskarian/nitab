import styled from "styled-components";

export const StyledSideMenu = styled.div`
 & label,
  & input {
    color: #e2e2e2;
    
  }
  & label::selection, & input::selection{
    background-color: #e2e2e2;
  }
  height: 100vh;
  position: relative;
  /* left: 0; */
  box-sizing: border-box;
  max-width: 400px;
  width: 100vw;
  background-color: rgba(22, 22, 22, 0.9);
  color: white;
  padding: 20px;
  transform: ${({ enabled }) => `translateX(${enabled ? "0" : "-400px"})`};
  transition: transform 450ms cubic-bezier(0.65, 0.05, 0.36, 1);
  font-family: ${({ font }) => font || "FiraCode"};
  border-radius: 0px 10px 10px 0px;
`;
export const SideMenuWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  position: absolute;
  z-index: 5;
  pointer-events: ${({ enabled }) => !enabled && "none"};
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
  margin-bottom: 10px;
  box-sizing: border-box;
  width: 100%;
`;

export const StyledNavItem = styled.div`
  display: inline-block;
  padding: 2px;
  margin: 0 5px;

  border-bottom: ${({ enabled }) => enabled && "2px solid"};
  & a {
    color: inherit;

    text-decoration: none;
  }
  &:first-child {
    margin-left: 0;
  }
`;
