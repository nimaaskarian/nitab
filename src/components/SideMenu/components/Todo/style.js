import styled from "styled-components";
import { DeleteButton } from "../styled";

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
