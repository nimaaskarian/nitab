/*global chrome*/

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";

import SearchResult from "../SearchResult";

import { nanoid } from "nanoid";
import { StyledSearchResultList } from "./style";

const SearchResultList = ({ currentCommand, searchCommand, term }) => {
  const searchResultRefs = Array(4).fill(useRef());
  const searchMode = useSelector(({ data }) => data.terminal.searchMode);

  const [results, setResults] = useState([]);
  const handleKeydown = useCallback(
    (event) => {
      if (+event.key && (event.altKey || event.ctrlKey)) {
        searchResultRefs[+event.key].current?.click();
      }
    },
    [searchResultRefs]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);
  useEffect(() => {
    const isNameSearch = currentCommand.name !== "search";
    function searchSuggest(term) {
      if (isNameSearch)
        return {
          url: searchCommand.function(term)(),
          header: {
            className: searchCommand.icon,
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

    switch (searchMode) {
      case 3: {
        chrome?.tabs?.query({}, (allTabs) => {
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
        chrome?.bookmarks?.search({ query: term }, (res) => {
          onSearchComplete(res.slice(0, 3 + isNameSearch));
        });
        break;
      case 1:
        chrome?.history?.search(
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
  }, [searchMode, term, currentCommand.name, searchCommand]);
  return (
    <StyledSearchResultList>
      {results
        .filter((e) => !!e)
        .map((result, i) => {
          return (
            <SearchResult
              ref={searchResultRefs[i]}
              key={result.key}
              result={result}
            />
          );
        })}
    </StyledSearchResultList>
  );
};

export default SearchResultList;
