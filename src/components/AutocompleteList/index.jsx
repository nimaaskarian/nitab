import React, { useEffect, useState } from "react";
import { setTerm } from "store/actions";
import { useDispatch, useSelector } from "react-redux";

import AutocompleteLogic from "./bl";
import AutocompleteItem from "components/AutocompleteItem";
import { Selected, StyledAutocompleteList } from "./style";

const Autocomplete = ({ isRtl, scrollLeft }) => {
  const term = useSelector(({ ui }) => ui.term);
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const ac = AutocompleteLogic();
  useEffect(() => {
    setSelectedIndex(0);
  }, [ac]);
  useEffect(() => {
    const onKeyDown = (e) => {
      if (ac[selectedIndex])
        switch (e.code) {
          case "KeyJ":
            if (!e.ctrlKey) break;
          case "ArrowDown":
            e.preventDefault();
            if (selectedIndex + 1 === ac.length) setSelectedIndex(0);
            else setSelectedIndex(selectedIndex + 1);
            break;
          case "KeyK":
            if (!e.ctrlKey) break;
          case "ArrowUp":
            e.preventDefault();
            if (selectedIndex) setSelectedIndex(selectedIndex - 1);
            else setSelectedIndex(ac.length - 1);
            break;
          case "Tab":
            if (ac[selectedIndex]) dispatch(setTerm(ac[selectedIndex].phrase));
            break;
          default:
            break;
        }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex, ac]);
  return (
    <>
      <Selected isRtl={isRtl} marginLeft={scrollLeft}>
        {(() => {
          const phrase = (ac[selectedIndex] || {}).phrase || "";
          if (
            (!isRtl && /[\u0600-\u06FF]+/.test(term)) ||
            !phrase.startsWith(term)
          )
            return null;
          return phrase;
        })()}
      </Selected>
      <StyledAutocompleteList isRtl={isRtl}>
        {ac.map((acItem, index) => {
          return (
            <AutocompleteItem
              onMouseEnter={() => setSelectedIndex(index)}
              selected={index === selectedIndex}
              key={acItem.key}
              suggestion={acItem}
            />
          );
        })}
      </StyledAutocompleteList>
    </>
  );
};

export default Autocomplete;
