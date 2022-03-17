import { nanoid } from "nanoid";
import React, { useEffect, useMemo, useState } from "react";

import { InputErrorNotifier, InputWrapper, StyledInput } from "./style";
const TextInput = (props) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const [visited, setVisited] = useState(false);
  const id = useMemo(() => nanoid(10), []);
  useEffect(() => {
    if (props.required && visited) {
      setError(!input);
    }
  }, [visited, input]);
  const placeholder = useMemo(
    () => props.placeholder || (props.required ? "Required" : "Optional"),
    [props.required]
  );
  useEffect(() => {
    if (typeof props.onChange === "function") props.onChange(input);
  }, [input, props.onChange]);
  return (
    <InputWrapper>
      <label htmlFor={id}>
        {props.label}
        {error ? <InputErrorNotifier /> : null}
      </label>

      <StyledInput
        placeholder={placeholder}
        id={id}
        onBlur={() => setVisited(true)}
        value={props.value === undefined ? input : props.value}
        type={props.type || "text"}
        onChange={(e) => setInput(e.target.value)}
      />
    </InputWrapper>
  );
};

export default TextInput;
