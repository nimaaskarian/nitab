import { Header } from "components/SideMenu/components/styled";
import React from "react";
import { useSelector } from "react-redux";
import isDark from "services/isdark-min";
import Commands from "./components/Commands";
import CommandContainer from "./components/Commands/style";
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
        <OverviewElement color={foreground.color}>
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
