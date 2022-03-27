import React from "react";
import { useSelector } from "react-redux";
import { StyledSearchMode } from "./style";

const searchModeItems = ["History", "Bookmark", "Tabs"];
const SearchMode = ({ isHistory }) => {
  const searchMode = useSelector(({ data }) => data.terminal.searchMode);

  if (!searchMode) return null;
  return <StyledSearchMode>{searchModeItems[searchMode - 1]}</StyledSearchMode>;
};

export default SearchMode;
