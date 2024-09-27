import React from 'react';

import STRING_SPACING from "./string_spacing.mjs";

function new_received(rec) {
	if (!rec)
		return "";
	let ret = "";
	ret = rec.substring(0, 19);
	ret = ret.replace(/T/g, "   ");
	return ret;
}

const r_list_display = (props) => {
	const items = props.items;
	const disp = new STRING_SPACING();

	const defs = [190, 8, 45, 45, 55, 30];

	disp.set_spacing(defs);

	return (
		<div className="r_list_display" data-testid="r_list_display-test">
		{disp.spacing_display("From", "To", "Subject", "Received")}
		{Array.isArray(items) && items.map((item) => {
			let nr = new_received(item.received);
			const spacing_result = disp.spacing_display(item.from, item.to, item.subject, nr);
			return (
					<button className="email_item" data-testid={"r_list_display-button-"+item.id} key={item.id} onClick={() => props.click_select_email(item.id)}>{spacing_result}</button>
			);
		})}
		</div>
	);
}

export default r_list_display;
