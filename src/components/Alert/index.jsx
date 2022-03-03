import { useSelector } from "react-redux";
import { AlertContainer } from "./style";
const Alert = ({ children, style, ...otherProps }) => {
  const fontFamily = useSelector(({ data }) => data.font);
  console.log(fontFamily);
  return (
    <AlertContainer font={fontFamily} style={{ ...style }} {...otherProps}>
      {children}
    </AlertContainer>
  );
};
export default Alert;
