/*global browser*/
/*global chrome*/

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import SearchResult from "./SearchResult";
import { termToCommand } from "../js/commands";

const SearchResultList = ({ commands }) => {
  const term = useSelector(({ ui }) => ui.term);
  const identifier = useSelector(({ data }) => data.identifier);
  const isHistory = useSelector(({ data }) => data.isHistory);
  const altNewtab = useSelector(({ data }) => data.altNewtab);
  const [results, setResults] = useState([]);
  useEffect(() => {
    const isNameSearch =
      termToCommand(term, identifier, commands).name === "search";
    function searchSuggest(term) {
      if (!isNameSearch)
        return {
          url: commands["search"](term)(),
          header: {
            className: "fontawe search",
          },
          title: term,
        };
    }
    function onSearchComplete(e) {
      setResults([searchSuggest(term), ...e]);
    }
    try {
      getAsyncResults();
    } catch (error) {}

    async function getAsyncResults() {
      switch (isHistory) {
        case 3: {
          chrome.tabs.query({}, (allTabs) => {
            onSearchComplete(
              allTabs
                .flatMap(({ url, title, windowId, index: tabs }) => {
                  if (
                    url.toLowerCase().includes(term.toLowerCase()) ||
                    title.toLowerCase().includes(term.toLowerCase())
                  )
                    return { windowId, tabs, title, url };
                })
                .filter((e) => e)
                .slice(0, 3 + isNameSearch)
            );
          });

          break;
        }
        case 2:
          chrome.bookmarks.search({ query: term }, (res) => {
            onSearchComplete(res.slice(0, 3 + isNameSearch));
          });
          break;
        case 1:
          chrome.history.search(
            {
              text: term,
              startTime: Date.now() - 14 * 24 * 3600 * 1000,
              maxResults: 3 + isNameSearch,
            },
            (res) => {
              onSearchComplete(res);
            }
          );
          break;
        default:
          onSearchComplete([]);
      }
    }
  }, [identifier, isHistory, term]);
  return (
    <div style={{ marginTop: "50px" }} className="search-results">
      {results
        .filter((e) => !!e)
        .map((e, i) => {
          return (
            <SearchResult
              onClick={() => {
                if (e.windowId === undefined) {
                  if (typeof e.url === "string") {
                    if (altNewtab) document.location = e.url;
                    else window.open(e.url);
                  } else {
                    e.url(altNewtab);
                  }
                } else {
                  const { tabs, windowId } = e;
                  browser.windows.update(windowId, { focused: true });
                  browser.tabs.highlight({ tabs, windowId });
                  if (altNewtab) window.close();
                }
              }}
              key={i}
              header={{
                text: e.title,
                className: e.header ? e.header.className : "",
              }}
            >
              {e.url}
            </SearchResult>
          );
        })}
    </div>
  );
};

export default SearchResultList;
