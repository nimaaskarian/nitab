import { nanoid } from "nanoid";
import React, { useEffect, useMemo, useState } from "react";

import { InputErrorNotifier, InputWrapper, StyledInput } from "./style";
const TextInput = ({
  required,
  value,
  label,
  placeholder,
  onChange = () => {},
}) => {
  const [error, setError] = useState(false);

  const [visited, setVisited] = useState(false);
  const id = useMemo(() => nanoid(10), []);
  useEffect(() => {
    if (required && visited) {
      setError(!value);
    }
  }, [visited, value]);

  return (
    <InputWrapper>
      <label htmlFor={id}>
        {label}
        {error ? <InputErrorNotifier /> : null}
      </label>

      <StyledInput
        placeholder={placeholder || (required ? "Required" : "Optional")}
        id={id}
        onBlur={() => setVisited(true)}
        value={value}
        type={"text"}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputWrapper>
  );
};

export default TextInput;
