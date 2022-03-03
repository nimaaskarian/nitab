import styled from "styled-components";

export const TaskbarIconElement = styled.a`
  color: ${({ color }) => color || "white"};
  text-decoration: none;
  font-size: 35px;
  margin: auto 8px 0;
  transition: cubic-bezier(0.93, 0.59, 0.67, 1.03) 150ms !important;
  &:hover {
    filter: brightness(0.85);
  }
`;
