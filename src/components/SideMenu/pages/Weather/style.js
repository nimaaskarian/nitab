import { DeleteButton } from "components/SideMenu/components/styled";
import styled from "styled-components";

export const ResultWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;
export const AddedCitiesWrapper = styled.div`
  margin-top: 10px;
`;
export const CityWrapper = styled.div`
  flex-grow: 1;
`;
export const IconWrapper = styled.span`
  margin-right: 5px;
  border-radius: 10px;
`;
export const StyledDeleteButton = styled(DeleteButton)`
  margin-left: 15;
`;
