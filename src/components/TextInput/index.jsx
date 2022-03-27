import { nanoid } from "nanoid";
import React, { useEffect, useMemo, useState } from "react";

import { InputErrorNotifier, InputWrapper, StyledInput } from "./style";
const TextInput = (props) => {
  const [error, setError] = useState(false);

  const [visited, setVisited] = useState(false);
  const id = useMemo(() => nanoid(10), []);
  useEffect(() => {
    if (props.required && visited) {
      setError(!props.value);
    }
  }, [visited, props.value]);
  const placeholder = useMemo(
    () => props.placeholder || (props.required ? "Required" : "Optional"),
    [props.required]
  );

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
        value={props.value}
        type={props.type || "text"}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </InputWrapper>
  );
};

export default TextInput;
