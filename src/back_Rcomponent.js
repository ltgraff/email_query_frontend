import React from 'react';

class Rcomponent  extends React.Component {
	constructor() {
		super();
		this.m_button = [true, false];
		this.display_str = "";
	}

//	state = {
//		content: ''
//	}

	button_change_state = (arg) => {
		for(let i=0;i<2;i++) {
			if (i === arg)
				this.m_button[i] = false;
			else
				this.m_button[i] = true;
		}
		this.display_str = "Hiya "+arg;
		this.setState({content: 'This is the button: '+arg});
	};

	render() {
		return (
			<>
				<button id="button0" disabled={!this.m_button[0]} onClick={()=>this.button_change_state(0)}> This is button A </button>
				<button id="button1" disabled={!this.m_button[1]} onClick={()=>this.button_change_state(1)}> Other button </button>
				<h1>{this.display_str}</h1>
			</>
		);
	}
}

export default Rcomponent;
