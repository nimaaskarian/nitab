import styled from "styled-components";

export const StyledVisualization = styled.div`
  width: 100%;
  height: 25%;
  position: absolute;
  bottom: 0;
  display: flex;
  gap: 2px;
  align-items: flex-end;
  justify-content: space-between;
`;
StyledVisualization.Bar = styled.div`
  flex-grow: 1;
  background-color: ${({ color }) => color || "white"};
  box-sizing: border-box;
  height: ${({ height }) => height * 2}%;

  transition: 50ms linear;
`;
