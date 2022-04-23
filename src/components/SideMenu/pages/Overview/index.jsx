import useIsDarkColor from "hooks/useIsDarkColor";
import React from "react";
import { useSelector } from "react-redux";
import Commands from "./components/Commands";
import OverviewElement from "./style";

const Overview = () => {
  const todoCount = useSelector(({ data }) => data.todos.length);
  const themesCount = useSelector(({ data }) => data.themes.list.length);
  const bgCount = useSelector(({ data }) => data.backgrounds.length);
  // const currentTheme = useSelector(({ data }) => data.themes.current);

  const foreground = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].foreground
  );
  const isDark = useIsDarkColor(foreground.color);

  return (
    <div>
      <OverviewElement.Container>
        <OverviewElement>
          <OverviewElement.Header>{todoCount}</OverviewElement.Header>
          <OverviewElement.Small>Todos</OverviewElement.Small>
        </OverviewElement>
        <OverviewElement>
          <OverviewElement.Header>{themesCount}</OverviewElement.Header>
          <OverviewElement.Small>Themes</OverviewElement.Small>
        </OverviewElement>
        <OverviewElement>
          <OverviewElement.Header>{bgCount}</OverviewElement.Header>
          <OverviewElement.Small>bckgrnds</OverviewElement.Small>
        </OverviewElement>
        <OverviewElement color={foreground.color} isDark={isDark}>
          <OverviewElement.Header>FG</OverviewElement.Header>
          <OverviewElement.Small>
            {foreground.isOvr ? "override" : "no override"}
          </OverviewElement.Small>
        </OverviewElement>
      </OverviewElement.Container>

      <Commands />
    </div>
  );
};

export default Overview;
