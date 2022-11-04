/*global chrome*/

import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { SearchResultIcon, StyledSearchResult } from "./style";

import usePushHistory from "hooks/usePushHistory";

const SearchResult = forwardRef(({ result }, ref) => {
  const pushHistory = usePushHistory()
  const enterOpensNewtab = useSelector(
    ({ data }) => data.terminal.enterOpensNewtab
  );

  const icon = result.header?.className;
  return (
    <StyledSearchResult
      ref={ref}
      onClick={() => {
        pushHistory()
        if (result.windowId === undefined) {
          if (typeof result.url === "string") {
            if (!enterOpensNewtab) document.location = result.url;
            else window.open(result.url);
          } else {
            result.url(enterOpensNewtab);
          }
        } else {
          const { tabs, windowId } = result;
          chrome?.windows.update(windowId, { focused: true });
          chrome?.tabs.highlight({ tabs, windowId });
          if (!enterOpensNewtab) window.close();
        }
      }}
    >
      <h4>
        <SearchResultIcon className={icon} />
        {result.title}
      </h4>
      <p>{result.url}</p>
    </StyledSearchResult>
  );
});

export default SearchResult;
