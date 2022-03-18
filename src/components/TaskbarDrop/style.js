import styled from "styled-components";

export const StyledTaskbarDrop = styled.div`
  width: ${({ hasPlus }) => (!hasPlus ? "10px" : "")};
  ${({ hasPlus }) =>
    !hasPlus
      ? `
background-color: black;
  border: 2px #ccc solid;
`
      : ""}
  border-radius: 4px;
  ${({ isOver, hasPlus }) =>
    isOver && !hasPlus
      ? `background-color: #ccc !important;
    border: 2px black solid !important;`
      : ""}
  & > button {
    filter: ${({ isOver }) => (isOver ? "brightness(.5)" : "")};
  }
  opacity: ${({ visible, hasPlus }) => (visible || hasPlus ? "1" : "0")};
`;
export const StyledButton = styled.button`
  background: transparent;
  box-shadow: none;
  border: none;
  color: white;
  font-size: 35px;
  cursor: pointer;

  margin-left: 5px;
`;
