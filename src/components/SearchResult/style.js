import styled from "styled-components";

export const StyledSearchResult = styled.div`
  font-size: 16px;
  padding: 10px;
  width: 40%;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  z-index: 4;
  user-select: none;
  
  & h4 {
    margin: 0;
  }
  & p {
    margin-bottom: 0;
    margin-top: 10px;
  }
  &:hover {
    text-overflow: clip;
    transition: 500ms ease-out;
  }
`;
export const SearchResultIcon = styled.span`
  margin-right: ${({ className }) => (className ? "20px" : "0px")};
`;
