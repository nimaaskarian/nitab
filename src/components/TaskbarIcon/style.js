import isDark from "services/isdark";
import styled from "styled-components";

export const TaskbarIconWrapper = styled.div`
  position: relative;
  margin-top: auto;
  margin-bottom: 0;
`;

export const StyledTaskbarIcon = styled.a`
  color: ${({ color }) => color} !important;
  text-decoration: none;
  margin-left: ${({ marginLeft }) => marginLeft || 0}px;
  margin-right: ${({ marginRight }) => marginRight || 0}px;
  font-size: 35px;
  transition: cubic-bezier(0.93, 0.59, 0.67, 1.03) 150ms !important;
  filter: ${({ isBlured }) => `brightness(${!isBlured ? 1 : 0.5})`};

  &:hover {
    filter: ${({ color }) => `brightness(${isDark(color) ? 1.15 : 0.85})`};
  }
`;

export const StyledFolderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  & > *{
    padding: 10px 0;
  }
  position: absolute;
  top: -100%;
  transform: translateY(-50%);
  width: 100%;
  transition: all ease-out 0.3s;
  opacity: ${({ enabled }) => enabled ? 1 : 0};
  align-items: center;
`
