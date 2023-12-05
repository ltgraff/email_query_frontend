import React from 'react';

const arg = [
	190, 8,
	'From', 45,
	'To', 45,
	'Subject', 55,
	'Date Received', 35
];

const R_List_Display = (props) => {
	const items = props.items;

	return (
		<div className="R_List_Display">
		<b>
			{string_spacing(...arg)}
		</b>
		{items.map((item) => (
			<div className="email_items">
				<h1>{item.em_from}</h1>
			</div>
		))}
		</div>
	);
}

/*
//		for (i=0;i<flist.length;i++) {
//			const item = flist[i];
//			spacing_result = string_spacing(190, 8, item.em_from, 45, item.em_to, 45, item.em_subject, 55, item.received, 35);
//			tmp.push(<button key={i} style={{fontSize: '12px', height: '25px', verticalAlign: 'bottom', padding: 0, marginBottom: '10px', lineHeight: '1px'}} 
//				onClick={() => click_select_email(item.em_body)}>{spacing_result}</button>);
		}
//		m_first_item = flist[0].received;
//		if (flist.length-1 > -1)
//			m_last_item = flist[flist.length-1].received;
//		else
//			m_last_item = m_first_item;

//		set_contacts(tmp);

}
*/

// 0:	total str size
// 1:	padding between strings
// 2:	str
// 3:	str_len
// 4:	str
// 5:	str_len
function string_spacing() {
	/*const [totalSize, padding, ...strings] = arguments;
	const combinedString = strings.reduce((result, str, index) => {
		result += str + ' '.repeat(padding);
		return result;
	}, '');
	const paddingSize = totalSize - combinedString.length;

	if (paddingSize > 0) {
		const paddedString = combinedString + ' '.repeat(paddingSize);
		return <pre>{paddedString}</pre>;
	}

	if (2 > 1)
		return <pre>{combinedString}</pre>;
*/

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

	if (2 > 1)
		return str;

	let tmp;

	len-=pad;
	if (typeof(str) !== 'string')
		tmp = ''+str;
	else
		tmp = str;
	if (tmp.length > len)
		tmp = tmp.substring(0, len);
	if (tmp.length < len+pad) {
		for (let i=tmp.length;i<len+pad;i++)
			tmp+=' ';
	}
	return tmp;
}

export default R_List_Display;
