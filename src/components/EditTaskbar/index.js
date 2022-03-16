import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { StyledEditTaskbar } from "./style";

const TextInput = (props) => {
  const [input, setInput] = useState("");
  useEffect(() => {
    props.onChange(input);
  }, [input]);

  const id = nanoid(10);
  return (
    <div>
      <label htmlFor={id}>props.label</label>
      <input
        id={id}
        value={input}
        type={props.type || "text"}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};

const EditTaskbar = () => {
  return (
    <StyledEditTaskbar>
      <TextInput onChange={console.log} />
    </StyledEditTaskbar>
  );
};

export default EditTaskbar;
