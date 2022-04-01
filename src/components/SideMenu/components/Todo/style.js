import styled from "styled-components";

export const TodoWrapper = styled.div`
  & * {
    color: #e2e2e2;
  }
  &:not(&:first-child) {
    margin-bottom: 10px;
  }
  padding: 10px;
  border-radius: 10px;
  background-color: #424242;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const TodoMessage = styled.div`
  text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
  flex-grow: 1;
`;
export const TodoButton = styled.a`
  color: ${({ color }) => color};
  margin-left: 15px;
  cursor: pointer;
`;
