import isDark from "services/isdark.min";
import styled from "styled-components";

const OverviewElement = styled.div`
  width: 62px;
  height: 62px;
  border-radius: 10px;
  cursor: default;
  background-color: ${(props) => props.color || "#e2e2e2"};
  & > * {
    color: ${(props) =>
      isDark(props.color || "#e2e2e2") ? "#e2e2e2" : "#333"};
  }
  &:hover {
    box-shadow: 0px 10px 14px -14px rgba(218, 218, 218, 0.8);
  }
  transition: box-shadow 250ms ease-out;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
OverviewElement.Header = styled.h1`
  margin: 0;
  font-size: 38px;
`;
OverviewElement.Small = styled.p`
  margin: 0;
  font-size: 12px;
  word-wrap: break-word;
  text-align: center;
  /* display: inline-block; */
`;
OverviewElement.Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
export default OverviewElement;
