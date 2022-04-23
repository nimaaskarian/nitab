import styled from "styled-components";
export const BackgroundWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;
export const StyledBackground = styled.div`
  & > video {
    position: fixed;
    min-width: 100%;
    min-height: 100%;
  }
  margin-left: ${({ parallax }) => parallax.x}vw;
  margin-top: ${({ parallax }) => parallax.y}vh;
  transform: scale(${({ scale }) => scale});
  background: ${({ background }) => background || "#333"};
  filter: ${({ blur, brightness }) =>
    `blur(${blur}px) brightness(${brightness || 1})`};
  transition: filter 450ms cubic-bezier(0.65, 0.05, 0.36, 1),
    margin 300ms ease-out;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  height: 100%;
  width: 100%;
  color: rgb(255, 255, 255);
  align-items: center;
  background-position-x: center !important;
  background-position-y: center !important;
  background-size: cover !important;
  transform: scale();

  transition: ${({ scale }) =>
      scale !== 1 ? "450ms cubic-bezier(0.65, 0.05, 0.36, 1)" : ""},
    margin 300ms ease-out;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;
