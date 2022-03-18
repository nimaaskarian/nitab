import styled from "styled-components";

export const StyledEditTaskbar = styled.form`
  position: relative;
  width: 400px;
  background-color: #333;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-shadow: 0px 6px 18px 5px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin-bottom: 40px;
  z-index: 4;
  & * {
    user-select: none;
    color: #e2e2e2;
  }
  & > div {
    margin: 5px;
  }
`;
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
export const Button = styled.button`
  display: inline-block;
  border: none;
  background-color: transparent;
  color: ${({ color }) => color || "#e2e2e2"};
  border-color: ${({ color }) => color || "#e2e2e2"};

  border-radius: 5px;
  cursor: pointer;
  transition: ease-out 150ms;
  font-family: inherit;
  border: 2px solid;
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
export const ColorPickerWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  & > * {
    width: 100% !important;
  }
  & > *,
  & input {
    background: rgb(66, 66, 66) !important;
  }
  & * {
    font-family: inherit !important;
  }
  & label {
    user-select: none;
  }
  & label,
  input {
    color: #e2e2e2 !important;
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  outline: none;
  border: none;
  box-shadow: none;
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
`;
