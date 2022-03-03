import styled from "styled-components";

export const BackgroundDiv = styled.div`
  margin-left: ${({ parallax }) => parallax.x}vw;
  margin-top: ${({ parallax }) => parallax.y}vh;
  transform: scale(${({ scale }) => scale});
  background: ${({ background }) => background || "#333"};
  filter: ${({ blur, brightness }) =>
    `blur(${blur}) brightness(${brightness})`};
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  height: 100%;
  width: 100%;
  font-family: FiraCode;
  color: rgb(255, 255, 255);
  align-items: center;
  background-position-x: center !important;
  background-position-y: center !important;
  background-size: cover !important;
  transition: 450ms cubic-bezier(0.65, 0.05, 0.36, 1), margin 300ms ease-out;
`;
export const BackgroundWrapperDiv = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;