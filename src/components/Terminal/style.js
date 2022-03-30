import styled from "styled-components";
import isDark from "services/isdark-min";
export const StyledTerminal = styled.div`
  z-index: 4;
  align-items: center;
  display: flex;
  width: 90vw;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 5vw;

  ${({ color }) => {
    return `&>*{
      color:${color} !important;
    }
  & *::selection{
    background-color:${color} !important;
    color:${isDark(color) ? "#CCC" : "#333"} !important;
  }`;
  }}
`;
export const TerminalInput = styled.input`
  color: inherit !important;
  font-family: inherit !important;
  margin: 0;
  width: 100%;
  border: none;
  background-color: transparent;
  box-shadow: none;
  font-size: 36px;
  font-weight: 500 !important;
  line-height: 2;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
export const TerminalOutput = styled.span`
  padding-left: 15px;
  border: none;
  background-color: transparent;
  box-shadow: none;
  font-size: 36px;
`;
export const TerminalAutoCompleteWrapper = styled.div`
  flex-grow: 1;
`;
