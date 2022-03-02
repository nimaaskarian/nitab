import styled from "styled-components";
import { isDark } from "services/Styles";
export const AppContainer = styled.div`
  font-family: ${({ font }) => `${font}, Inconsolata, IranSans`};
  ${({ foreground: { color, priority } }) => {
    return ` & *{
      color:${color} ${priority};
    }
  & *::selection{
    background-color:${color} ${priority};
    color:${isDark(color) ? "#CCC" : "#333"} ${priority};
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
  z-index: 2;
  line-height: 1;
`;
