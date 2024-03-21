/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
import { useState } from "react";

function Square() {
  const [value, setValue] = useState(null);
  function handleClick() {
    setValue("X");
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="boardRow">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="boardRow">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="boardRow">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
