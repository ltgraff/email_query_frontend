import React from 'react';
import TIMER from './timer.js';

import STRING_SPACING from './string_spacing.js';

var m_timer = new TIMER();

const r_list_display = (props) => {
	const items = props.items;
	const disp = new STRING_SPACING();

	const defs = [190, 8, 45, 45, 55, 30];

	disp.set_spacing(defs);

	return (
		<div className="r_list_display">
		{disp.spacing_display("From", "To", "Subject", "Received")}
		{items.map((item) => {
			const spacing_result = disp.spacing_display(item.em_from, item.em_to, item.em_subject, item.received);
			return (
					<button className="email_item" key={item.eid} onClick={() => props.click_select_email(item.em_body)}>{spacing_result}</button>
			);
		})}
		{m_timer.restart()}
		{console.log("timer: "+m_timer.get_elapsed_milli())}
		</div>
	);
}

export default r_list_display;
