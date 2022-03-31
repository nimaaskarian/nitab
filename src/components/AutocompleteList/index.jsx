import React, { useEffect, useState } from "react";
import { setTerm } from "store/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import AutocompleteLogic from "./bl";
import AutocompleteItem from "components/AutocompleteItem";
import { StyledAutocompleteList } from "./style";

const Autocomplete = ({ isRtl }) => {
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
          case "ArrowDown":
            e.preventDefault();
            if (selectedIndex + 1 === ac.length) setSelectedIndex(0);
            else setSelectedIndex(selectedIndex + 1);
            break;

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
    <StyledAutocompleteList isRtl={isRtl}>
      {ac.map((e, i) => {
        return (
          <AutocompleteItem
            onMouseEnter={() => setSelectedIndex(i)}
            selected={i === selectedIndex}
            key={e.key}
            suggestion={e}
          />
        );
      })}
    </StyledAutocompleteList>
  );
};

export default Autocomplete;
