import styled from "styled-components";
import { isDark } from "services/Styles";
export const AppContainer = styled.div`
  font-family: ${({ font }) => `${font}, FiraCode, IranSans`};
  ${({ foreground: { color, priority } }) => {
    return ` & *{
      color:${color} ${priority};
    }
  & *::selection{
    background-color:${color} ${priority};
    color:${isDark(color) ? "#CCC" : "#333"} ${priority};
  }`;
  }}
  & * {
    transition: color 450ms cubic-bezier(0.65, 0.05, 0.36, 1);
  }
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
  z-index: 2;
  line-height: 1;
`;