import styled from "styled-components";

export const StyledTaskbar = styled.div`
  transition: 450ms cubic-bezier(0.65, 0.05, 0.36, 1), filter 200ms ease-out;
  opacity: 1;
  justify-self: end;
  display: flex;
  bottom: 0;
  z-index: 5;
  position: absolute;
  margin-bottom: 20px;
`;
