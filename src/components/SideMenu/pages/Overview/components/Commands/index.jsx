import Accordion from "components/SideMenu/components/Accordion";
import {
  Header,
  TwoConditionElement,
} from "components/SideMenu/components/styled";
import TextInput from "components/SideMenu/components/TextInput";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CommandContainer from "./style";
const Commands = () => {
  const commands = useSelector(({ data }) => data.commands);

  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <Header>Commands</Header>
      <TextInput
        value={searchTerm}
        onChange={setSearchTerm}
        label="Search"
        placeholder="Type to search..."
      />
      {Object.entries(commands)
        .filter(
          ([key, value]) =>
            key.includes(searchTerm) ||
            value.args.findIndex((e) => e.includes(searchTerm)) !== -1 ||
            !searchTerm
        )
        .map(([key, value]) => (
          <CommandContainer color={value.color} key={key}>
            <CommandContainer.Name color={value.color}>
              <CommandContainer.Icon
                className={value.icon}
              ></CommandContainer.Icon>
              {key}
            </CommandContainer.Name>

            {value.args.map((e, i) => {
              const [noInput, hasInput] = e.split("%?%");
              if (!hasInput) return <div key={key + i}>{noInput}</div>;
              return (
                <React.Fragment key={key + i}>
                  <strong>Has Input:</strong>
                  <div>{hasInput}</div>
                  <strong>Has No Input:</strong>
                  <div>{noInput}</div>
                </React.Fragment>
              );
            })}
          </CommandContainer>
        ))}
    </div>
  );
};

export default Commands;
