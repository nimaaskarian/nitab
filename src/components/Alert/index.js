import { useSelector } from "react-redux";

const Alert = ({ children, style, ...otherProps }) => {
  const fontFamily = useSelector(({ data }) => data.font);
  return (
    <div className="alert" style={{ ...style, fontFamily }} {...otherProps}>
      {children}
    </div>
  );
};
export default Alert;
