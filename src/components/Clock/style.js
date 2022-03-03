import styled from "styled-components";

export const ClockWrapperDiv = styled.div`
  display: flex;
  flex-direction: column;
`;
export const ClockDiv = styled.div`
  z-index: 5;
  transition: 450ms cubic-bezier(0.65, 0.05, 0.36, 1);
  user-select: none;
  position: absolute;
  top: 50%;
`;
export const ClockDateDiv = styled.div`
  animation: moveFromRight 0.8s ease-out;
  font-size: 28px;
  cursor: pointer;
`;
export const ClockTimeDiv = styled.div`
  animation: moveFromLeft 0.8s ease-out;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 76px;
  letter-spacing: 5px;
`;