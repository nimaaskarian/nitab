import styled from "styled-components";

export const ClockDiv = styled.div`
  display: flex;
  flex-direction: column;
  ${({ position }) => {
    return `
    position: ${position === "center" ? "" : "absolute"};
    top: ${position === "center" ? "" : "20px"};
    ${position}: 5vw;
    `;
  }}
  align-items:${({ align }) => align};
  z-index: 4;
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
