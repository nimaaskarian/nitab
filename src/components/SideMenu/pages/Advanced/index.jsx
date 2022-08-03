import { Header } from "components/SideMenu/components/styled";
import React from "react";
import { setCustomCss } from "store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { StyledTextarea } from "./style";
const Advanced = () => {
  const currentTheme = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current]
  );
  const dispatch = useDispatch();

  return (
    <div>
      <Header>Custom CSS</Header>
      <StyledTextarea
        onChange={(el) => dispatch(setCustomCss(el.target.value))}
      >
        {currentTheme.customCss}
      </StyledTextarea>
    </div>
  );
};

export default Advanced;
