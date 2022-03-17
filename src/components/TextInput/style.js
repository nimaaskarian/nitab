import styled from "styled-components";

export const InputWrapper = styled.div`
  font-size: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
export const InputErrorNotifier = styled.span`
  color: red;
  margin-left: 5px;
  &::before {
    content: "*";
  }
`;
export const StyledInput = styled.input`
  max-width: 150px;
  font-size: 16px;
  background: transparent;
  font-family: inherit;
  box-shadow: none;
  outline: none;
  border: none;
`;
