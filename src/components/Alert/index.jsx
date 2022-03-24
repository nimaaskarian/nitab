import { useSelector } from "react-redux";
import { AlertContainer } from "./style";
const Alert = ({ children, style, ...otherProps }) => {
  const fontFamily = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].font
  );
  return (
    <AlertContainer font={fontFamily} style={{ ...style }} {...otherProps}>
      {children}
    </AlertContainer>
  );
};
export default Alert;
