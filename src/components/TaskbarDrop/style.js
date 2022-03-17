import styled from "styled-components";

export const StyledTaskbarDrop = styled.div`
  background-color: black;
  border: 2px #ccc solid;
  border-radius: 4px;
  width: 10px;
  ${({ isOver }) =>
    isOver
      ? `background-color: #ccc !important;
    border: 2px black solid !important;`
      : ""}

  opacity: ${({ visible }) => (visible ? "1" : "0")};
`;
