import styled from "styled-components";

export const StyledAutocompleteList = styled.div`
  position: absolute;
  margin-top: 5px;

  direction: ${({ isRtl }) => (isRtl ? "rtl" : "ltr")};
  right: ${({ isRtl }) => isRtl && "0"}; ;
`;
export const Selected = styled.div`
  direction: ${({ isRtl }) => (isRtl ? "rtl" : "ltr")};
  left: -${({ marginLeft }) => marginLeft}px;
  position: absolute;
  white-space: nowrap;
  overflow: scroll;
  width: 100%;
  top: 0;
  height: 100%;
  z-index: -1000;
  pointer-events: none;
  color: inherit !important;
  font-family: inherit !important;
  font-size: 36px;
  font-weight: 500 !important;
  line-height: 2;
  opacity: 0.5;
`;
