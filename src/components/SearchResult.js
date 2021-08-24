import React from "react";
import "../css/SearchResult.css";
const SearchResult = ({ children, key, header, onClick }) => {
  return (
    <div
      key={key}
      onClick={onClick}
      className="search-result foreground-change"
    >
      <h3>
        <span
          style={{ marginRight: header.className ? "20px" : "0px" }}
          className={header.className}
        ></span>
        {header.text}
      </h3>
      <p>{children}</p>
    </div>
  );
};

export default SearchResult;
