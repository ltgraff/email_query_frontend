import React from 'react';
import TIMER from './timer.js';

var m_timer = new TIMER();

const arg = [
	190, 8,
	'From', 45,
	'To', 45,
	'Subject', 55,
	'Date Received', 30
];

const r_list_display = (props) => {
	const items = props.items;

	return (
		<div className="r_list_display">
		<b> 
			{m_timer.start()}
			{string_spacing(...arg)}
		 </b>
		{items.map((item) => {
			const spacing_result = string_spacing(190, 8, item.em_from, 45, item.em_to, 45, item.em_subject, 55, item.received, 30); 
			return (
				<div className="email_items">
					<button key={item.id} style={{fontSize: '12px', height: '25px', verticalAlign: 'bottom', padding: 0, color: '#000000',backgroundColor: '#AAAAAA', marginBottom: '3px', lineHeight: '0px'}}
					onClick={() => props.click_select_email(item.em_body)}>{spacing_result}</button>
				</div>
			);
		})}
		{m_timer.stop()}
		{console.log("timer: "+m_timer.get_elapsed_milli())}
		</div>
	);
}

// Ensure each argument takes up a certain amount of space, to ensure text lines up
// 0:	total str size
// 1:	padding between strings
// 2:	str
// 3:	str_len
// 4:	str
// 5:	str_len
function string_spacing() {
	let disp = '';
	let i, q;

	for (i=2, q=3;i<arguments.length;i+=2, q+=2)
		disp += slim_string(arguments[i], arguments[q], arguments[1]);
	for (i=disp.length;i<arguments[0];i++)
		disp+=' ';
	return (
		<>
		<pre>
		{disp}
		</pre>
		</>
	);
}

// Make sure a string is padded to the correct amount
function slim_string(str, len, pad) {
	// Convert non-string values to strings
	str = String(str);

	// Truncate the string to the specified length
	if (str.length > len) 
		str = str.substring(0, len);

	// Pad the string with spaces to the specified length
	while (str.length < len + pad) 
		str += ' ';

	return str;
}

export default r_list_display;
