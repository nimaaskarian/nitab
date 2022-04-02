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
  color: ${({ color }) => color || "#e2e2e2"};
  border-color: ${({ color }) => color || "#e2e2e2"};
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
    background-color: ${({ color }) => color || "#e2e2e2"};
    color: #333;
  }
`;

export const MultipleInputsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;
