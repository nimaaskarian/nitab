/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import {
  Button,
  ButtonsWrapper,
  CloseButton,
  ColorPickerWrapper,
  MultipleInputsWrapper,
  StyledEditTaskbar,
} from "./style";
import TextInput from "components/TextInput";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskbarIcon,
  editTaskbarIcon,
  resetTaskbarIcons,
  setEditTaskbarIndex,
  toggleTaskbarEdit,
} from "store/actions";
import TaskbarIcon from "components/TaskbarIcon";

const defaultValues = {
  icon: "",
  url: "",
  color: "#ccc",
  marginLeft: "",
  marginRight: "",
};
const EditTaskbar = () => {
  const editTaskbarIndex = useSelector(({ ui }) => ui.editTaskbarIndex);

  const iconToEdit = useSelector(
    ({ data }) => data.taskbar.icons[editTaskbarIndex]
  );
  console.log(iconToEdit);
  const [icon, setIcon] = useState(defaultValues.icon);
  const [url, setUrl] = useState(defaultValues.url);
  const [color, setColor] = useState(defaultValues.color);
  const [marginLeft, setMarginLeft] = useState(defaultValues.marginLeft);
  const [marginRight, setMarginRight] = useState(defaultValues.marginRight);

  useEffect(() => {
    const values = iconToEdit || defaultValues;
    setIcon(values.icon);
    setUrl(values.url);
    setColor(values.color);
    setMarginLeft(values.marginLeft);
    setMarginRight(values.marginRight);
  }, [iconToEdit]);

  const dispatch = useDispatch();
  const addToLeft = () => {
    dispatch(
      addTaskbarIcon(
        { icon, url, color, marginLeft, marginRight },
        editTaskbarIndex ? editTaskbarIndex - 1 : 0
      )
    );
    dispatch(setEditTaskbarIndex(editTaskbarIndex + 1));
  };
  const addToRight = () => {
    dispatch(
      addTaskbarIcon(
        { icon, url, color, marginLeft, marginRight },
        editTaskbarIndex + 1
      )
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!icon || !color) return;
    if (iconToEdit) {
      dispatch(
        editTaskbarIcon(
          { icon, url, color, marginLeft, marginRight },
          editTaskbarIndex
        )
      );
    } else {
      dispatch(addTaskbarIcon({ icon, url, color, marginLeft, marginRight }));
    }
  };
  return (
    <StyledEditTaskbar onSubmit={handleSubmit}>
      <CloseButton
        className="fa fa-xmark"
        type="button"
        onClick={() => {
          dispatch(toggleTaskbarEdit());
        }}
      />
      <TaskbarIcon
        {...{ icon, url, color, marginLeft, marginRight }}
        index={-1}
      />
      <MultipleInputsWrapper>
        <TextInput
          required
          onChange={setIcon}
          value={icon}
          label="icon (fontawesome, ex: fa fa-heart)"
        />
        <TextInput value={url} onChange={setUrl} label="url" />
      </MultipleInputsWrapper>
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
        <Button type="submit" disabled={!icon}>
          {iconToEdit ? "Edit" : "Add"}
        </Button>
        {iconToEdit ? (
          <>
            <Button type="button" disabled={!icon} onClick={addToLeft}>
              Add To Left
            </Button>
            <Button type="button" disabled={!icon} onClick={addToRight}>
              Add To Right
            </Button>
          </>
        ) : null}
        <Button
          type="button"
          color="red"
          onClick={() => dispatch(resetTaskbarIcons())}
        >
          Clear Icons
        </Button>
      </ButtonsWrapper>
    </StyledEditTaskbar>
  );
};

export default EditTaskbar;