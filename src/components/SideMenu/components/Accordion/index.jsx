import React, { useState } from "react";
import { AccordionButton, AccordionHeader } from "./style";

const Accordion = ({ headerComponent, children, defaultIsOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen || false);

  return (
    <>
      <AccordionHeader onClick={() => setIsOpen(!isOpen)}>
        {headerComponent}
        <AccordionButton
          className={`fa ${isOpen ? "fa-angle-down" : "fa-angle-up"}`}
        />
      </AccordionHeader>

      {isOpen ? children : null}
    </>
  );
};

export default Accordion;
