/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState } from "react";
import { ChromePicker } from "react-color";
import {
  Button,
  ButtonsWrapper,
  ColorPickerWrapper,
  MultipleInputsWrapper,
  StyledEditTaskbar,
} from "./style";
import TextInput from "components/TextInput";
import { useDispatch } from "react-redux";
import { addTaskbarIcon } from "store/actions";
import TaskbarIcon from "components/TaskbarIcon";
const EditTaskbar = () => {
  const [icon, setIcon] = useState("");
  const [url, setUrl] = useState("");
  const [color, setColor] = useState("#CCC");
  const [marginLeft, setMarginLeft] = useState("");
  const [marginRight, setMarginRight] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!icon || !url || !color) return;

    dispatch(addTaskbarIcon({ icon, url, color, marginLeft, marginRight }));
  };
  return (
    <StyledEditTaskbar onSubmit={handleSubmit}>
      <TaskbarIcon
        {...{ icon, url, color, marginLeft, marginRight }}
        index={-1}
      />
      <TextInput
        required
        onChange={setIcon}
        label="icon (fontawesome, ex: fa fa-heart)"
      />
      <TextInput onChange={setUrl} label={"url"} required />
      <MultipleInputsWrapper>
        <TextInput
          onChange={(e) => setMarginLeft(+e || "")}
          value={marginLeft}
          label="left Margin(px)"
        />
        <TextInput
          onChange={(e) => setMarginRight(+e || "")}
          value={marginRight}
          label="right Margin(px)"
        />
      </MultipleInputsWrapper>
      <ColorPickerWrapper>
        <ChromePicker color={color} onChange={({ rgb }) => setColor(rgb)} />
      </ColorPickerWrapper>

      <ButtonsWrapper>
        <Button type="submit">Add</Button>
      </ButtonsWrapper>
    </StyledEditTaskbar>
  );
};

export default EditTaskbar;
