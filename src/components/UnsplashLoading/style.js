import styled, { keyframes } from "styled-components";

const rotate = keyframes`
from{
  transform: rotate(0);
}
to{
  transform: rotate(360deg);
}
`;
export const LoadingWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  & p {
    z-index: 1;
    position: absolute;
  }
  & i {
    margin-right: 5px;
    animation: ${rotate} 0.7s ease-in-out infinite;
  }
`;

export const Loading = styled.div`
  width: ${({ width }) => width}%;
  background-color: #abe9b391;
  height: 100%;
`;
