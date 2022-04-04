import { Header } from "components/SideMenu/components/styled";
import React from "react";
import { useSelector } from "react-redux";
import isDark from "services/isdark-min";
import Commands from "./components/Commands";
import CommandContainer from "./components/Commands/style";

const Overview = () => {
  const [totalCount, completedCount] = useSelector(({ data }) => [
    data.todos.length,
    data.todos.filter((e) => e.completed).length,
  ]);
  const themesLength = useSelector(({ data }) => data.themes.list.length);
  const currentTheme = useSelector(({ data }) => data.themes.current);

  const foreground = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].foreground
  );
  return (
    <div>
      <Header>Todos</Header>
      <div>
        <strong>Total: </strong>
        <span>{totalCount}</span>
      </div>
      <div>
        <strong>Completed: </strong>
        <span>{completedCount}</span>
      </div>
      <Header>Themes</Header>
      <div>
        <strong>Total: </strong>
        <span>{themesLength}</span>
      </div>
      <div>
        <strong>Selected: </strong>
        <span>{currentTheme}</span>
      </div>
      <Header>Foreground Color</Header>
      <strong>Color: </strong>
      <CommandContainer.Name
        style={{ display: "inline-block" }}
        color={foreground.color}
      >
        {foreground.color}
      </CommandContainer.Name>
      <div>
        <strong>Will override? </strong>
        <span>{foreground.isOvr ? "Yes" : "No"}</span>
      </div>
      <Commands />
    </div>
  );
};

export default Overview;
