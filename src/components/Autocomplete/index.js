import React, { useEffect, useState } from "react";
import { setTerm } from "../../store/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import "./style.css";

const Autocomplete = ({ style }) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(0);
  const ac = useSelector(({ ui }) => ui.ac || [], shallowEqual);

  useEffect(() => {
    setSelected(0);
  }, [ac]);
  useEffect(() => {
    const onKeyDown = (e) => {
      if (ac[selected])
        switch (e.code) {
          case "ArrowDown":
            e.preventDefault();
            if (selected + 1 === ac.length) setSelected(0);
            else setSelected(selected + 1);
            break;

          case "ArrowUp":
            e.preventDefault();
            if (selected) setSelected(selected - 1);
            else setSelected(ac.length - 1);
            break;
          case "Tab":
            if (ac[selected]) dispatch(setTerm(ac[selected].phrase));
            break;
          default:
            break;
        }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, ac]);

  return (
    <div className="autocomplete">
      {ac
        ? ac.map((e, i) => {
            return (
              <div
                style={style}
                key={i}
                onClick={() => {
                  dispatch(setTerm(ac[i].phrase));
                }}
                onMouseEnter={() => {
                  setSelected(i);
                }}
                className={`autocomplete-item ${
                  selected === i ? "selected" : ""
                }`}
              >
                {e.icon ? (
                  <span
                    className={e.icon}
                    style={{ marginRight: "5px" }}
                  ></span>
                ) : null}

                {e.phrase}
              </div>
            );
          })
        : null}
    </div>
  );
};

export default Autocomplete;
