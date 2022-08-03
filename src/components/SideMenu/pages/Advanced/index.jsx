import { Header } from "components/SideMenu/components/styled";
import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { setCustomCss } from "store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
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
      <CodeEditor
        placeholder="Please enter some custom css if you know what you're doing..."
        style={{
          background: "transparent",
        }}
        value={currentTheme.customCss}
        onChange={(env) => dispatch(setCustomCss(env.target.value))}
        language="css"
      />
    </div>
  );
};

export default Advanced;
