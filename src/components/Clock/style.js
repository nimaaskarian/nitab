import styled from "styled-components";

export const ClockWrapperDiv = styled.div`
  display: flex;
  flex-direction: column;
`;
export const ClockDiv = styled.div`
  ${({ clockPos }) => {
    return `
    position: ${clockPos === "center" ? "" : "absolute"};
    top: ${clockPos === "center" ? "" : "20px"};
    ${clockPos}: 5vw;
    `;
  }}
  z-index: 5;
  transition: 450ms cubic-bezier(0.65, 0.05, 0.36, 1);
  user-select: none;
`;
export const ClockDateDiv = styled.div`
  font-size: 28px;
  cursor: pointer;
`;
export const ClockTimeDiv = styled.div`
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 76px;
  letter-spacing: 5px;
`;
