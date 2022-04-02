import styled from "styled-components";

export const TodoWrapper = styled.div`
  & * {
    color: ${({ completed }) => (completed ? "#222" : "#e2e2e2")};
  }
  &:not(&:first-child) {
    margin-bottom: 10px;
  }
  background-color: ${({ completed }) => completed && "#e2e2e2"};
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #e2e2e2;
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
  &:hover {
    color: ${({ color }) => color};
  }
  transition: color 50ms linear;

  margin-left: 15px;
  cursor: pointer;
`;
