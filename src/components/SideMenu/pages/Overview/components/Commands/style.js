import { TwoConditionElement } from "components/SideMenu/components/styled";
import isDark from "services/isdark-min";
import styled from "styled-components";

const CommandContainer = styled(TwoConditionElement)`
  display: flex;
  flex-direction: column;
  align-items: start;
  overflow: hidden;
  & strong {
    margin: 5px 0;
  }
  margin-top: 5px;
`;
CommandContainer.Name = styled.div`
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
  &,
  & * {
    background-color: ${({ color }) => color || "#e2e2e2"};
    color: ${({ color }) =>
      isDark(color || "#e2e2e2") ? "#e2e2e2" : "#333"} !important;
  }
`;
CommandContainer.Icon = styled.span`
  margin-right: ${({ className }) => className && "5px"};
`;
export default CommandContainer;
