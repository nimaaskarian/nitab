import styled from "styled-components";
import { isDark } from "services/Styles";
export const TerminalDiv = styled.div`
  direction: ${({ isRtl }) => (isRtl ? "rtl" : "ltr")}
  align-items: center;
  display: flex;
  margin-top: -10px;
  width: 90vw;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 5vw;
`;
export const TerminalInput = styled.input`
  font-family: inherit !important;
  margin: 0;
  width: calc(90vw - 55px);
  border: none;
  background-color: rgba(51, 51, 51, 0);
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
  background-color: rgba(51, 51, 51, 0);
  box-shadow: none;
  font-size: 36px;
  animation: moveFromBottom 0.375s ease-out backwards;
  animation-delay: 0.5625;
`;
export const TerminalInputWrapper = styled.div`
  ${({ color }) => {
    console.log(color);
    return `& *{
      color:${color} !important;
    }
  & *::selection{
    background-color:${color} !important;
    color:${isDark(color) ? "#CCC" : "#333"}!important;
  }`;
  }}
`;
