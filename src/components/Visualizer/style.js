import styled from "styled-components";

export const StyledVisualization = styled.div`
  width: 100%;
  height: 25%;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  display: flex;
  gap: 2px;
  align-items: flex-end;
  justify-content: space-between;
`;
StyledVisualization.Bar = styled.div.attrs((props) => ({
  style: {
    background: props.color || "white",
    height: `${props.height}%`,
  },
}))`
  flex-grow: 1;
  box-sizing: border-box;
`;
