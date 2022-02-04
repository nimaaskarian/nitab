import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setTerm } from "../actions";
import "../css/Autocomplete.css";

const Autocomplete = ({ ac, setTerm, term, style }) => {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelected(0);
  }, [term]);
  useEffect(() => {
    const onKeyDown = (e) => {
      if (ac[selected]) 
      switch (e.code) {
        case "ArrowDown":
          e.preventDefault();
          if (selected + 1 === ac.length) setSelected(0);
          else setSelected(selected + 1);
          break;

        case "ArrowUp":
          e.preventDefault();
          if (selected) setSelected(selected - 1);
          else setSelected(ac.length - 1);
          break;
        case "Tab":
          if (ac[selected]) setTerm(ac[selected].phrase);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, ac]);
  
  return (
    <div className="autocomplete">
      {ac
        ? ac.map((e, i) => {
            return (
              <div
                style={style}
                key={i}
                onClick={() => {
                  setTerm(ac[i].phrase);
                }}
                onMouseEnter={() => {
                  setSelected(i);
                }}
                className={`autocomplete-item ${
                  selected === i ? "selected" : ""
                }`}
              >
                {e.phrase}
              </div>
            );
          })
        : null}
    </div>
  );
};
const mapStateToProp = (state) => {
  const _ac = state.ui.ac || [];
  return {
    ac: _ac.filter((e) => e.phrase !== state.ui.term),
    term: state.ui.term,
  };
};
export default connect(mapStateToProp, { setTerm })(Autocomplete);
