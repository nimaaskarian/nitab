import isDark from "services/isdark.min";
import styled from "styled-components";

export const StyledAutocompleteItem = styled.div`
  cursor: pointer;
  padding: 2px;
  border-radius: 5px;

  &,
  & * {
    transition: none !important;
  }
  ${({ selected, color }) => {
    if (selected)
      return `
      padding: 4px;

      background-color: ${color};
      &, & *{
        color: ${isDark(color) ? "#ccc" : "#333"} !important;
      }
      `;
    else return `&, & *{color: ${color} !important;}`;
  }}

  font-size: ${({ selected }) => (selected ? "20px" : "16px")};
`;
