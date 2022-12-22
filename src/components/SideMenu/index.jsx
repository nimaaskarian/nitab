/* eslint-disable jsx-a11y/anchor-is-valid */
import EditTaskbar from "components/SideMenu/pages/EditTaskbar";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSideMenuIndex } from "store/actions";
import TodoList from "components/SideMenu/pages/TodoList";
import {
  CloseButton,
  StyledNavbar,
  SideMenuWrapper,
  StyledNavItem,
  StyledSideMenu,
  ContentWrapper,
} from "./style";
import Themes from "./pages/Themes";
import Weather from "./pages/Weather";
import Overview from "./pages/Overview";
import Advanced from "./pages/Advanced";

const Navbar = ({ items, enabled, setEnabled }) => {
  return (
    <StyledNavbar>
      {items.map((e, i) => {
        return (
          <StyledNavItem
            onClick={() => setEnabled(i + 1)}
            key={e}
            enabled={i + 1 === enabled}
          >
            {e}
          </StyledNavItem>
        );
      })}
    </StyledNavbar>
  );
};
const PagesHandler = ({ children, enabled }) => {
  return <ContentWrapper>{children[enabled - 1]}</ContentWrapper>;
};
const SideMenu = () => {
  const sideMenuIndex = useSelector(({ ui }) => ui.sideMenuIndex);
  const dispatch = useDispatch();
  const close = () => dispatch(setSideMenuIndex(0));
  const setPage = (index) => dispatch(setSideMenuIndex(index));
  const font = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].font
  );
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Escape" || e.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <SideMenuWrapper enabled={sideMenuIndex} onClick={close}>
      <StyledSideMenu
        font={font}
        enabled={sideMenuIndex}
        onClick={(e) => e.stopPropagation()}
      >
        <Navbar
          items={[
            "Edit Taskbar",
            "To-dos",
            "Themes",
            "Weather",
            "Overview",
            "Advanced",
          ]}
          enabled={sideMenuIndex}
          setEnabled={setPage}
        />
        <CloseButton onClick={close} className="fa fa-xmark" />
        <PagesHandler enabled={sideMenuIndex}>
          <EditTaskbar />
          <TodoList />
          <Themes />
          <Weather />
          <Overview />
          <Advanced />
        </PagesHandler>
      </StyledSideMenu>
    </SideMenuWrapper>
  );
};

export default SideMenu;
