import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const RenderInWindow = (props) => {
  const [container, setContainer] = useState(null);
  const newWindow = useRef(window);

  useEffect(() => {
    const div = document.createElement("div");
    setContainer(div);
  }, []);

  useEffect(() => {
    if (container) {
      newWindow.current = window.open("", "", "");
	if (newWindow.current === null) {
		console.log("ERROR... newWindow.current is null!");
		return;
	}
      newWindow.current.document.body.appendChild(container);
      const curWindow = newWindow.current;
      return () => curWindow.close();
    }
  }, [container]);

  return container && createPortal(props.children, container);
};

export default function App() {
  const [open, setOpen] = useState();
  return (
    <>
      <button onClick={() => setOpen(true)}>open</button>
      {open && <RenderInWindow>hello world</RenderInWindow>}
    </>
  );
}
