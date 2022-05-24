import styled from "styled-components";

export const ButtonsWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  & > * {
    flex: 1 1;
    margin-left: 5px;
  }
  & > *:first-child {
    margin: 0 !important;
  }
`;
export const Header = styled.h3`
  color: #e2e2e2;
`;
export const Button = styled.button`
  display: inline-block;
  border: none;
  background-color: transparent;
  color: ${({ bgColor }) => bgColor || "#e2e2e2"};
  border-color: ${({ bgColor }) => bgColor || "#e2e2e2"};
  border-style: solid;
  border-width: 2px;
  border-radius: 5px;
  cursor: pointer;
  transition: ease-out 150ms;
  font-family: inherit;
  padding: 10px;
  ${({ disabled }) =>
    disabled
      ? `&,&:hover{
          background-color:transparent !important;
          color:#5f5f5f !important;
          border-color:#5f5f5f !important;
        }`
      : ""}
  &:hover {
    background-color: ${({ bgColor }) => bgColor || "#e2e2e2"};
    color: ${({ color }) => color || "#333"} !important;
  }
`;

export const MultipleInputsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;
export const TwoConditionElement = styled.div`
  & {
    --color: ${({ enabled, color, bgColor }) =>
      enabled ? color || "#222" : bgColor || "#e2e2e2"};
    --bg-color: ${({ color }) => color || "#e2e2e2"};
  }
  border: 2px solid var(--bg-color);
  background-color: ${({ enabled }) => enabled && "var(--bg-color)"};
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;

  &,
  & * {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: var(--color) !important;
  }
`;
export const DeleteButton = styled.button`
  &:hover {
    color: #f28fad !important;
  }
  padding: 0;
  background-color: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  transition: color 100ms ease-in;
  margin-left: 15px;
  cursor: pointer;
`;
export const Text = styled.p`
  &,
  & * {
    color: #e2e2e2;
  }
`;
