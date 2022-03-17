import { isDark } from "services/Styles";
import styled from "styled-components";

export const TaskbarIconElement = styled.a`
  color: ${({ color }) => color} !important;
  text-decoration: none;
  margin-left: ${({ marginLeft }) => marginLeft || 8}px;
  margin-right: ${({ marginRight }) => marginRight || 8}px;
  margin-top: auto;
  margin-bottom: 0;

  font-size: 35px;
  transition: cubic-bezier(0.93, 0.59, 0.67, 1.03) 150ms !important;
  &:hover {
    filter: ${({ color }) => `brightness(${isDark(color) ? 1.15 : 0.85})`};
  }
`;
