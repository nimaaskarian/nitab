import CurrentColorContext from "context/CurrentColorContext";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { setTerm } from "store/actions";
import { StyledAutocompleteItem } from "./style";

const AutocompleteItem = ({
  suggestion: { phrase, icon },
  onMouseEnter,
  selected,
}) => {
  const currentColor = useContext(CurrentColorContext);
  const dispatch = useDispatch();
  return (
    <StyledAutocompleteItem
      onClick={() => {
        dispatch(setTerm(phrase));
      }}
      onMouseEnter={onMouseEnter}
      color={currentColor}
      selected={selected}
    >
      <span className={icon} style={{ marginRight: "5px" }} />

      {phrase}
    </StyledAutocompleteItem>
  );
};

export default AutocompleteItem;
