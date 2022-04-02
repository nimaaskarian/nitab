import {
  Button,
  ButtonsWrapper,
  Header,
} from "components/SideMenu/components/styled";
import localforage from "localforage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTheme, deleteTheme, setCurrentTheme } from "store/actions";
import { ClockWrapper, DeleteButton, Theme, ThemeBackground } from "./style";

const Themes = () => {
  const { list, current } = useSelector(({ data }) => data.themes);
  const backgrounds = useSelector(({ data }) => data.backgrounds);
  const [renderedBackgrounds, setRenderedBackgrounds] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    (async function () {
      let _backgrounds = {};
      for (let index = 0; index < backgrounds.length; index++) {
        const backgroundObject = backgrounds[index];
        if (backgroundObject.id) {
          const background = await localforage.getItem(backgroundObject.id);
          _backgrounds[backgroundObject.id] = background;
        }
      }
      if (_backgrounds) setRenderedBackgrounds(_backgrounds);
    })();
  }, [backgrounds]);
  return (
    <div>
      <Header>Add Theme</Header>
      <ButtonsWrapper>
        <Button onClick={() => dispatch(addTheme())}>Add a blank theme</Button>
      </ButtonsWrapper>
      <Header>Themes</Header>
      {list.map((theme, index) => {
        const backgroundObject = backgrounds[theme.currentBackground];
        const blob = renderedBackgrounds[backgroundObject.id];

        let bgUrl = "";
        try {
          bgUrl = `url('${window.URL.createObjectURL(blob)}')`;
        } catch (error) {}
        return (
          <Theme
            isCurrent={index === current}
            onClick={() => dispatch(setCurrentTheme(index))}
          >
            <DeleteButton
              className="fa fa-trash"
              onClick={() => dispatch(deleteTheme(index))}
            />
            <ThemeBackground
              blur={backgroundObject.blur.notTerminal}
              brightness={backgroundObject.br.notTerminal}
              background={bgUrl || backgroundObject.cssValue}
            />

            <ClockWrapper
              font={theme.font}
              position={theme.clock.position}
              color={theme.foreground.color}
            >
              <div>{theme.clock.format24 ? "0:00" : "12:00 AM"}</div>
            </ClockWrapper>
          </Theme>
        );
      })}
    </div>
  );
};

export default Themes;
