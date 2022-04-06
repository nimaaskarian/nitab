import CurrentColorContext from "context/CurrentColorContext";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTerm } from "store/actions";
import { StyledAutocompleteItem } from "./style";

const AutocompleteItem = ({
  suggestion: { phrase, icon, color },
  onMouseEnter,
  selected,
}) => {
  const [currentColor, defaultColor, isOvr] = useContext(CurrentColorContext);
  const dispatch = useDispatch();
  return (
    <StyledAutocompleteItem
      onClick={() => {
        dispatch(setTerm(phrase));
      }}
      onMouseEnter={onMouseEnter}
      color={
        color ? (color === true || isOvr ? defaultColor : color) : currentColor
      }
      selected={selected}
    >
      <span className={icon} style={{ marginRight: "5px" }} />

      {phrase}
    </StyledAutocompleteItem>
  );
};

export default AutocompleteItem;
