import styled from "styled-components";
import isDark from "services/isdark.min";
export const AppContainer = styled.div`
  font-family: ${({ font }) => `${font}`};
  ${({ color }) => {
    return `& *{
      color:${color};
    }
  & *::selection{
    background-color:${color};
    color:${isDark(color) ? "#CCC" : "#333"};
  }`;
  }}
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  height: 100vh;
  width: 100vw;
  align-items: center;
  position: absolute;
  top: 0;
  line-height: 1;
`;
