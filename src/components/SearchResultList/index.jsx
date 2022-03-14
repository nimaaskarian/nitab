/*global chrome*/

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import SearchResult from "../SearchResult";

import termToCommand from "services/Commands/termToCommand";
import { nanoid } from "nanoid";

const SearchResultList = ({ commands }) => {
  const term = useSelector(({ ui }) => ui.term);
  const identifier = useSelector(({ data }) => data.terminal.identifier);
  const searchMode = useSelector(({ data }) => data.terminal.searchMode);
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const isNameSearch =
      termToCommand(term, identifier, commands).name === "search";
    function searchSuggest(term) {
      if (!isNameSearch)
        return {
          url: commands["search"].function(term)(),
          header: {
            className: commands["search"].icon,
          },
          title: term,
          key: nanoid(10),
        };
    }
    function onSearchComplete(searchResults) {
      setResults([
        searchSuggest(term),
        ...searchResults.map((searchResult) => {
          return { ...searchResult, key: nanoid(10) };
        }),
      ]);
    }
    try {
      if (chrome) getAsyncResults();
    } catch (error) {}

    async function getAsyncResults() {
      switch (searchMode) {
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
  }, [identifier, searchMode, term]);
  return (
    <div style={{ marginTop: "50px" }} className="search-results">
      {results
        .filter((e) => !!e)
        .map((result, i) => {
          return <SearchResult key={result.key} result={result} />;
        })}
    </div>
  );
};

export default SearchResultList;
