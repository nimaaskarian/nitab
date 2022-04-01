import styled from "styled-components";

export const StyledEditTaskbar = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  justify-content: space-between;
  & * {
    user-select: none;
  }
  & > div {
    margin: 5px 0;
  }
  & > div:first-child {
    margin-top: 0;
  }
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
