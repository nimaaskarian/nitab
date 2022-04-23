import styled from "styled-components";
export const AppContainer = styled.div`
  font-family: ${({ font }) => `${font}`};
  ${({ color, isDark }) => {
    return `& *{
      color:${color};
    }
  & *::selection{
    background-color:${color};
    color:${isDark ? "#CCC" : "#333"};
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
