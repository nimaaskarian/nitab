import React from "react";
import { SearchModeDiv } from "./style";

const _isHistoryItems = ["History", "Bookmark", "Tabs"];
const SearchMode = ({ isHistory }) => {
  if (!isHistory) return null;
  return <SearchModeDiv>{_isHistoryItems[isHistory - 1]}</SearchModeDiv>;
};

export default SearchMode;
