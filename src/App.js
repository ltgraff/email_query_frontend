// npm start

import React, {useState, useEffect} from 'react';
import DOMPurify from 'dompurify';
import timer from './timer.js';
import Rcomponent from './Rcomponent';
//import ReactDOM from 'react-dom';
import './App.css';


var m_tab = null;
var m_parsed_sql = null;
//var m_email_amount = 50;
var m_first_item = null;
var m_last_item = null;
var m_id_list = [ ];
var m_command = "cur";

function App() {
	const [contacts, set_contacts] = useState(['hiya! this is the initial state']);
	const [loading, set_loading] = useState(true);
	useEffect(() => {
		display_update();
		// Disable useEffect dependency warning
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	var m_display_string = "";

	//const [m_display_string, set_display_string] = useState('');
	//const [m_email_amount, set_email_amount] = useState(10);

	//const [m_slider_value, setSliderValue] = useState(50); // Initial value of the slider

  // Function to handle slider value changes
	/*const handleSliderChange = (event) => {
		setSliderValue(event.target.value);
		m_email_amount = parseInt(event.target.value);
		set_display_string('');
		// display_update();
		update_email_list();
	};*/

	const m_timer = new timer();

	function err(err_str) {
		throw new Error("Error: "+err_str);
	}

	// Called during refresh of page and inital loading
	function display_update() {
		// var		scoped to function body
		// let		scoped to block

		let dtmp = new timer();
		let ftmp = new timer();

		ftmp.start();

		fetch('http://localhost:3001').then(response => {
			ftmp.stop();
			dtmp.start();

			let tmp = response.text();

			console.log("response from fetch: "+tmp);
			//return response.text();
			return tmp;
		})
		.then((data) => {
			set_loading(false);
			m_parsed_sql = JSON.parse(data);
			update_email_list();

			dtmp.stop();

			console.log("in display_update()");
			console.log("fetch timer: \t\t"+ftmp.get_elapsed_milli());
			console.log(".then data timer: \t"+dtmp.get_elapsed_milli());
		})
		.catch(error => {
			err("An error occurred in display_update: "+error);
		});
	}

	/*
	* Add an email item to the proper position of the list, by date descending
	*/
	function email_add_item(flist, item) {
		let idate = new Date(item.received);
		item.pdate = idate; // <-- vert here

		if (flist.length < 1) {
			flist.push(item);
			return;
		}
		for (let i=0;i<flist.length;i++) {
			if (item.pdate > flist[i].pdate) {
				flist.unshift(item);
				return;
			}
		}
		flist.push(item);
	}

	function update_next() {
		let i, item;
		let flist = [ ], tmp = [ ];
		let spacing_result = "";

		console.log("update next..");

		for (i=0;i<m_parsed_sql.length;i++) {
			item = m_parsed_sql[i];
			email_add_item(flist, item);
		}
		for (i=0;i<flist.length;i++) {
			const item = flist[i];
			spacing_result = string_spacing(190, 8, item.em_from, 45, item.em_to, 45, item.em_subject, 55, item.received, 35);
			tmp.push(<button key={i} style={{fontSize: '12px', height: '25px', verticalAlign: 'bottom', padding: 0, marginBottom: '10px', lineHeight: '1px'}} 
				onClick={() => click_select_email(item.em_body)}>{spacing_result}</button>);
		}
		m_first_item = flist[0].received;
		if (flist.length-1 > -1)
			m_last_item = flist[flist.length-1].received;
		else
			m_last_item = m_first_item;

		set_contacts(tmp);
	}

	function update_default() {
		let tmp = [ ];
		let spacing_result = "";

		m_first_item = m_parsed_sql[0].received;
		if (m_parsed_sql.length-1 > -1)
			m_last_item = m_parsed_sql[m_parsed_sql.length-1].received;
		else
			m_last_item = m_first_item;

		for (let i=0;i<m_parsed_sql.length;i++) {
			const item = m_parsed_sql[i];
			spacing_result = string_spacing(190, 8, item.em_from, 45, item.em_to, 45, item.em_subject, 55, item.received, 35);
			tmp.push(<button key={i} style={{fontSize: '12px', height: '25px', verticalAlign: 'bottom', padding: 0, marginBottom: '10px', lineHeight: '1px'}} 
				onClick={() => click_select_email(item.em_body)}>{spacing_result}</button>);
		}
		set_contacts(tmp);
	}

	function update_email_list() {
		m_id_list = [ ];

		if (m_parsed_sql === null) {
			console.log('m_parsed_sql is null');
			return;
		}

		if (m_command === "next")
			update_next();
		else
			update_default();
	}

	function click_update_email_list(value) {
		if (value === "cur") {
			m_first_item = null;
			m_last_item = null;
			m_id_list = [ ];
		}
		m_timer.start();
		handle_post_request(value);
	}

	function click_select_email(em_body) {
		if (m_tab === null) {
			m_tab = window.open('', '_blank');
			if (m_tab === null) {
				console.log('New tab could not be opened, possibly disable popup blocker');
				return;
			}
			m_tab.addEventListener('beforeunload', () => {  
				m_tab = null;
			});
			m_tab.document.title = 'Message';
			//m_tab.document.body.style.backgroundColor = 'yellow';
		}
		m_tab.document.body.innerHTML = em_body;
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
	
	function HtmlRenderer({ htmlContent }) {
		const sanitizedHtml = DOMPurify.sanitize(htmlContent);
		return (
			<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
		);
	}

	function handle_post_request(cmd) {
		let tmp1 = new timer();
		let tmp2 = new timer();

		tmp1.start();

		m_command = cmd;
		const postData = {
			key1: m_command,
			key2: m_first_item,
			key3: m_last_item,
			key4: m_id_list,
		};

		fetch('http://localhost:3001/api/send-data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Specify the content type
			},
			body: JSON.stringify(postData), // Convert data to JSON format
		})
		.then((response) => {
			tmp1.stop();
			tmp2.start();
			if (! response.ok)
				err("Network response was not ok: "+response.text());
			update_email_list();
			return response.text();
		})
		.then((data) => {
			tmp2.stop();
			m_parsed_sql = JSON.parse(data);
			update_email_list();

			m_timer.stop();

			console.log("fetch to .then: \t"+tmp1.get_elapsed_milli());
			console.log(".then to data: \t\t"+tmp2.get_elapsed_milli());
			console.log("Total timer from: \t"+m_timer.get_elapsed_milli());
			console.log(" ");
			console.log(" ");
		})
		.catch((error) => { // here..
			err("POST request error: "+error);
		});
	}
	

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

	/*
        <button onClick={handle_post_request("prev")}>Perform POST Request</button>
			<input 
				type='range'
				min='1'
				max='50'
				value={m_slider_value} // Bind the value to the 
				onChange={handleSliderChange} // Handle changes to the slider
				className='slider'
				id='myRange'
			/>
			<p>
				Value: {m_slider_value}
			</p>

	*/

	const arg = [
		190, 8,
		'From', 45,
		'To', 45,
		'Subject', 55,
		'Date Received', 35
	];
	return (
		<main>
			{loading === true ? (
				<div>
					<h1>Loading..</h1>
				</div>
			) : (

		<div className='slidecontainer'>
			<Rcomponent onChildClick={click_update_email_list}/>
				<b>
					{string_spacing(...arg)}
				</b>
				<div style={{
					width:		'1500px',
					height:		'550px',
					overflowY:	'scroll',
					padding:	'0px 0px'
				}}>
					{contacts}
				</div>
				<br/>
				<br/>
				<HtmlRenderer htmlContent={m_display_string} />
			</div>
				)
			}
		</main>
	);
}

export default App;
