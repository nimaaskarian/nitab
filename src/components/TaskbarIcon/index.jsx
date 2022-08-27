// eslint-disable-next-line jsx-a11y/anchor-has-content

import { useEffect, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteTaskbarIcon,
  editTaskbarIcon,
  setCurrentDragging,
  setEditTaskbarIndex,
  setSideMenuIndex,
} from "store/actions";

import defaultCommands from "services/Commands/defaultCommands";

import { StyledTaskbarIcon, TaskbarIconWrapper, StyledFolderWrapper } from "./style";
import TaskbarDrop from "components/TaskbarDrop";

const TaskbarIcon = forwardRef((props, ref) => {
  const isBlured = useSelector(
    ({ ui }) =>
      ui.sideMenuIndex &&
      ui.editTaskbarIndex !== props.index &&
      props.index !== -1
  );
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    if (isDragging) {
      if (props.index === -1 && props.icon) {
        const propsCopy = { ...props };
        delete propsCopy.index;
        dispatch(setCurrentDragging(propsCopy));
      } else dispatch(setCurrentDragging(props.index));
    } else {
      dispatch(setCurrentDragging(-1));
    }
  }, [isDragging]);

  const enterOpensNewtab = useSelector(
    ({ data }) => data.terminal.enterOpensNewtab
  );
  const sideMenuIndex = useSelector(({ ui }) => ui.sideMenuIndex);
  const { r, g, b, a } = props.color || {};
  const [folderActive, setFolderActive] = useState(false);

  function InnerIcon(subProps) {
    return (
      <StyledTaskbarIcon
        ref={ref}
        onClick={(e) => {
          if (sideMenuIndex) {
            dispatch(setSideMenuIndex(1));
            e.preventDefault();
            dispatch(setEditTaskbarIndex(subProps.index));
          } else if (subProps.folder) {
            e.preventDefault();
            setFolderActive(!folderActive)
          }
        }}
        onDoubleClick={() => dispatch(deleteTaskbarIcon(subProps.index))}
        color={
          ![null, undefined].includes(r ?? g ?? b)
            ? `rgba(${r},${g},${b},${a})`
            : subProps.color || null
        }
        marginLeft={subProps.marginLeft}
        isBlured={isBlured}
        marginRight={subProps.marginRight}
        target={enterOpensNewtab ? "_blank" : "_self"}
        className={subProps.icon}
        href={subProps.url && !subProps.folder ? defaultCommands.url.function(subProps.url)() : "#"}
        rel="noreferrer"
      >
        {subProps.children}
      </StyledTaskbarIcon>

    )
  }

  console.log(folderActive)

  function Wrapper({ children }) {
    if (props.folder) return <TaskbarDrop visible={true} onDrop={(dragging) => {
      console.log(console.log(dragging))
      typeof dragging === "object"
        && dispatch(editTaskbarIcon({ ...props, folder: [...props.folder, dragging] }, props.index))
    }}>{children}</TaskbarDrop>
    return <>{children}</>
  }

  return (
    <TaskbarIconWrapper
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {props.folder && <StyledFolderWrapper enabled={folderActive}>
        {props.folder && props.folder.map((icon) => {
          return <InnerIcon {...icon} />
        })}
      </StyledFolderWrapper>}
      <InnerIcon {...props}>
        <Wrapper>
        </Wrapper>
      </InnerIcon>
    </TaskbarIconWrapper>
  );
});
export default TaskbarIcon;
