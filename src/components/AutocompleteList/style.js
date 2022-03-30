import styled from "styled-components";

export const StyledAutocompleteList = styled.div`
  position: absolute;
  margin-top: 5px;

  direction: ${({ isRtl }) => (isRtl ? "rtl" : "ltr")};
  right: ${({ isRtl }) => isRtl && "5vw"}; ;
`;
