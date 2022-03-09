import styled from "styled-components";
import { isDark } from "services/Styles";
export const TerminalDiv = styled.div`
  direction: ${({ isRtl }) => (isRtl ? "rtl" : "ltr")};
  & > span {
    padding-${({ isRtl }) => (isRtl ? "right" : "left")}:15px;
  }
  align-items: center;
  display: flex;
  margin-top: -10px;
  width: 90vw;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 5vw;

  ${({ color }) => {
    return `& *{
      color:${color} !important;
    }
  & *::selection{
    background-color:${color} !important;
    color:${isDark(color) ? "#CCC" : "#333"} !important;
  }`;
  }}
`;
export const TerminalInput = styled.input`
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
  border: none;
  background-color: transparent;
  box-shadow: none;
  font-size: 36px;
`;
export const TerminalAutoCompleteWrapper = styled.div`
  flex-grow: 1;
`;
