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
      <button onClick={() => handleButtonClick1()}> Prev </button>
      <button onClick={() => handleButtonClick2()}> Refresh </button>
      <button onClick={() => handleButtonClick3()}> Next </button>
      <button onClick={() => handleButtonClick4()}> Reset </button>
    </div>
  );
}

export default r_commands;
