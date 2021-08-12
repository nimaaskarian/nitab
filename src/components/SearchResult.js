import React from "react";
import "./css/SearchResult.css";
const SearchResults = ({ children, key, header, onClick }) => {
  return (
    <div
      key={key}
      onClick={onClick}
      className="search-result foreground-change"
    >
      <h1>
        <span
          style={{ marginRight: header.className ? "20px" : "0px" }}
          className={header.className}
        ></span>
        {header.text}
      </h1>
      <p>{children}</p>
    </div>
  );
};

export default SearchResults;
