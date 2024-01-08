import React from 'react';

function r_commands({ onChildClick }) {

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

  return (
    <div>
      <button data-testid="r_command_prev" className="r_command_item" onClick={() => handleButtonClick1()}> Prev </button>
      <button data-testid="r_command_cur" className="r_command_item" onClick={() => handleButtonClick2()}> Refresh </button>
      <button data-testid="r_command_next" className="r_command_item" onClick={() => handleButtonClick3()}> Next </button>
      <button data-testid="r_command_reset" className="r_command_item" onClick={() => handleButtonClick4()}> Reset </button>
    </div>
  );
}

export default r_commands;
