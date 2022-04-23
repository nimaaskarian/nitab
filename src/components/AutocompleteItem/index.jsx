import CurrentColorContext from "context/CurrentColorContext";
import useIsDarkColor from "hooks/useIsDarkColor";
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
  const itemColor = color
    ? color === true || isOvr
      ? defaultColor
      : color
    : currentColor;
  const isDark = useIsDarkColor(itemColor);
  const dispatch = useDispatch();
  return (
    <StyledAutocompleteItem
      onClick={() => {
        dispatch(setTerm(phrase));
      }}
      onMouseEnter={onMouseEnter}
      color={itemColor}
      isDark={isDark}
      selected={selected}
    >
      <span className={icon} style={{ marginRight: "5px" }} />

      {phrase}
    </StyledAutocompleteItem>
  );
};

export default AutocompleteItem;
