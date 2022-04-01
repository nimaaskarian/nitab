import EditTaskbar from "components/SideMenu/pages/EditTaskbar";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsSideMenu } from "store/actions";
import TodoList from "components/SideMenu/pages/TodoList";
import {
  CloseButton,
  StyledNavbar,
  SideMenuWrapper,
  StyledNavItem,
  StyledSideMenu,
} from "./style";
const NavItem = ({ children, onClick, enabled }) => {
  console.log(enabled);
  return (
    <StyledNavItem enabled={enabled}>
      <a href="#" onClick={onClick}>
        {children}
      </a>
    </StyledNavItem>
  );
};
const Navbar = ({ items, enabled, setEnabled }) => {
  return (
    <StyledNavbar>
      {items.map((e, i) => {
        return (
          <NavItem
            onClick={() => setEnabled(i)}
            key={e}
            enabled={i === enabled}
          >
            {e}
          </NavItem>
        );
      })}
    </StyledNavbar>
  );
};
const PagesHandler = ({ children, enabled }) => {
  return <>{children[enabled]}</>;
};
const SideMenu = () => {
  const [focusedPage, setFocusedPage] = useState(0);
  const isSideMenu = useSelector(({ ui }) => ui.isSideMenu);
  console.log(isSideMenu);
  const dispatch = useDispatch();
  const close = () => dispatch(setIsSideMenu(false));

  const font = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].font
  );
  return (
    <SideMenuWrapper enabled={isSideMenu} onClick={close}>
      <StyledSideMenu
        font={font}
        enabled={isSideMenu}
        onClick={(e) => e.stopPropagation()}
      >
        <Navbar
          items={["Edit Taskbar", "To-dos", "Themes"]}
          enabled={focusedPage}
          setEnabled={setFocusedPage}
        />
        <CloseButton onClick={close} className="fa fa-xmark" />
        <PagesHandler enabled={focusedPage}>
          <EditTaskbar />
          <TodoList />
        </PagesHandler>
      </StyledSideMenu>
    </SideMenuWrapper>
  );
};

export default SideMenu;
