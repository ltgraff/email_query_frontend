import React, { useState } from 'react';

function R_COMMANDS({ onChildClick }) {
	const [m_display, set_display] = useState(0);

  const handleButtonClick1 = () => {
    onChildClick("prev");
  };

  const handleButtonClick2 = () => {
    onChildClick("cur");
  };

  const handleButtonClick3 = () => {
    onChildClick("next");
  };

  const handleButtonClick4 = () => {
    onChildClick("reset");
  };

  const handleButtonClick5 = () => {
	  console.log("display button clicked, m_display: "+m_display);
    onChildClick("display");
		if (m_display === 1)
		  set_display(0);
	  else
		  set_display(1);
  };

  return (
    <div>
      <button data-testid="r_command_prev" className="r_command_item" onClick={() => handleButtonClick1()}> Prev </button>
      <button data-testid="r_command_cur" className="r_command_item" onClick={() => handleButtonClick2()}> Refresh </button>
      <button data-testid="r_command_next" className="r_command_item" onClick={() => handleButtonClick3()}> Next </button>
      <button data-testid="r_command_display" className="r_command_item" onClick={() => handleButtonClick5()}> {m_display ? "Switch to Email" : "Switch to Text"} </button>
      <button data-testid="r_command_reset" className="r_command_item" onClick={() => handleButtonClick4()}> Reset </button>
    </div>
  );
}

export default R_COMMANDS;
