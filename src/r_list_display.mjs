import React from 'react';

import STRING_SPACING from "./string_spacing.mjs";

const r_list_display = (props) => {
	const items = props.items;
	const disp = new STRING_SPACING();

	const defs = [190, 8, 45, 45, 55, 30];

	disp.set_spacing(defs);

	return (
		<div className="r_list_display" data-testid="r_list_display-test">
		{disp.spacing_display("From", "To", "Subject", "Received")}
		{Array.isArray(items) && items.map((item) => {
			const spacing_result = disp.spacing_display(item.em_from, item.em_to, item.em_subject, item.received);
			return (
					<button className="email_item" data-testid={"r_list_display-button-"+item.eid} key={item.eid} onClick={() => props.click_select_email(item.em_body)}>{spacing_result}</button>
			);
		})}
		</div>
	);
}

export default r_list_display;
