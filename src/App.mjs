// npm start

import React, {useState, useEffect} from 'react';
import DOMPurify from 'dompurify';

import PostalMime from 'postal-mime';

import timer from "./timer.mjs";
import R_COMMANDS from "./r_commands.mjs";
import R_LIST_DISPLAY from "./r_list_display.mjs";

import R_DATE_PICKER from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { error_throw, error_set, error_append, error_disp } from "./error_handler.mjs";

const __FILE__ = "App.mjs";

function err_throw(error) {
	return error_throw(error, __FILE__);
}

function err_set(error) {
	return error_set(error, __FILE__);
}

function err_append(error) {
	return error_append(error, __FILE__);
}

function err_disp(error) {
	return error_disp(error, __FILE__);
}

var m_tab = null;
var m_parsed_sql = null;
var m_first_item = null;
var m_last_item = null;
var m_id_list = [ ];
var m_command = "cur";

function App() {
	const [contacts, set_contacts] = useState("");
	const [loading, set_loading] = useState(true);

	const form_initial_state = {
		date_start:  "",
		date_end:  "",
		from: "",
		to:  "",
		subject: ""
	}

	const [date_selected_start, set_date_start] = useState("");
	const [date_selected_end, set_date_end] = useState("");

	const [form, set_form] = useState(form_initial_state);
	const handle_change = (e) => {
		set_form({
			...form,
			[e.target.name]: e.target.value
		});
	};

	useEffect(() => {
		display_update();
		// Disable useEffect dependency warning
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [window_dim, window_dim_set] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		window.addEventListener('resize', window_dim_update);
		return () => {
			window.removeEventListener('resize', window_dim_update);
		};
	}, [window_dim]);

	var m_display_string = "";

	const m_timer = new timer();

	const window_dim_update = () => {
		window_dim_set({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	};

	//open_tab();



	function reset_column_inputs() {
		set_form(form_initial_state);
		set_date_start("");
		set_date_end("");
	}

	function tab_is_valid() {
		if (m_tab && m_tab.document && m_tab.document.body)
			return 1;
		return 0;
	}

	function update_tab() {
		var em_body = m_parsed_sql[0].em_body;
		var em_from = m_parsed_sql[0].em_from;
		var em_to = m_parsed_sql[0].em_to;
		var em_received = m_parsed_sql[0].received;

		const parser = new PostalMime();
		parser.parse(em_body).then(email => {
			if (! tab_is_valid())
				err_throw("Tab is not valid");
			let hdr = "To: "+em_to+"\nFrom: "+em_from+"\nDate: "+em_received+"\nSubject: "+email.subject;

			if (email.attachments.length > 0) {
				hdr += "\n\n";
				for (let i = 0; i < email.attachments.length; i++) {
					const blob = new Blob([email.attachments[i].content]);
					const url = URL.createObjectURL(blob);

					hdr += "attachment: <a href="+url+" download="+email.attachments[i].filename+">"+email.attachments[i].filename+"</a>\n";
				}
			}

			m_tab.document.title = email.subject;
			if (email.html) {
				m_tab.document.body.innerHTML = "<pre>"+hdr+"\n\n</pre>"+email.html;
				console.log("parsed html");
			} else {
				m_tab.document.body.innerHTML = "<pre>"+hdr+"\n\n"+email.text+"</pre>";
				console.log("parsed text only");
			}
			m_tab.document.head.innerHTML += "<link rel=\"icon\" href=\"email_icon.ico\" />";
		}).catch(error => {
			err_disp("mime parse error: "+error.text);
		}); 
}

	function click_select_email(id) {
		open_tab();

		console.log("click_select_email");

		if (handle_post_select("email", id) < 0) {
			err_disp("click_select_email for id: "+id);
			return -1;
		}
	}

	function handle_post_select(message_type, message_id) {
		console.log("handle_post_select id: "+message_id);

		m_command = "select "+message_type;

		const post_data = {
			key1: m_command,
			key2: "",
			key3: "",
			key4: "",
			key5: "",
			key6: "",
			key7: "",
			key8: "",
			key9: message_id,
		};

		fetch('http://localhost:3001/api/send-data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(post_data),
		})
		.then((response) => {
			if (!response.ok)
				err_throw("handle_post_request received bad response");
			return response.text();
		})
		.then((data) => {
			m_parsed_sql = JSON.parse(data);
			update_tab();
		})
		.catch((error) => {
			err_disp(error);
		});
		return 0;
	}


	// Called during refresh of page and inital loading
	function display_update() {
		fetch('http://localhost:3001').then(response => {
			return response.text();
		})
		.then((data) => {
			set_loading(false);
			m_parsed_sql = JSON.parse(data);
			if (!m_parsed_sql || !m_parsed_sql[0])
				err_throw("display_update: Could not parse SQL");
			if (update_email_list() < 0)
				err_throw("display_update: update_email_list failed");
		})
		.catch(error => {
			err_disp(error);
		});
	}

	// Called when refreshing due to a command
	function handle_post_request(cmd) {
		m_command = cmd;
		const post_data = {
			key1: m_command,
			key2: form.to,
			key3: form.from,
			key4: form.subject,
			key5: date_selected_start,
			key6: date_selected_end,
			key7: m_first_item,
			key8: m_last_item,
			key9: m_id_list,
		};

		fetch('http://localhost:3001/api/send-data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(post_data),
		})
		.then((response) => {
			if (!response.ok)
				err_throw("handle_post_request received bad response");
			return response.text();
		})
		.then((data) => {
			m_parsed_sql = JSON.parse(data);
			if (update_email_list() < 0)
				err_throw("handle_post_request .then data");
		})
		.catch((error) => {
			err_disp(error);
		});
		return 0;
	}

	function open_tab() {
		if (m_tab !== null) 
			return;
		m_tab = window.open('', '_blank');
		//m_tab = window.open('about:blank');
		if (m_tab === null) {
			console.log('New tab could not be opened, possibly disable popup blocker');
			return;
		}
		m_tab.addEventListener('beforeunload', () => {  
			m_tab = null;
		});
	}

	/*
	* Add an email item to the proper position of the list, by date descending
	*/
	function email_add_item(flist, item) {
		let idate = new Date(item.received);
		item.pdate = idate;

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
		let i;
		let flist = [ ];

		for (i=0;i<m_parsed_sql.length;i++) 
			email_add_item(flist, m_parsed_sql[i]);
		m_first_item = flist[0].received;
		if (flist.length-1 > -1)
			m_last_item = flist[flist.length-1].received;
		else
			m_last_item = m_first_item;
		set_contacts(flist);
		return 1;
	}

	function update_default() {
		console.log("update_default");

		m_first_item = m_parsed_sql[0].received;
		if (m_parsed_sql.length-1 > -1)
			m_last_item = m_parsed_sql[m_parsed_sql.length-1].received;
		else
			m_last_item = m_first_item;
		set_contacts(m_parsed_sql);
		return 1;
	}

	function update_email_list() {
		console.log("update_email_list");
		if (! m_parsed_sql[0]) {
			set_contacts("");
			return 0;
		}
		console.log("update_email_list (do some work)");
		m_id_list = [ ];
	
		if (m_command === "next")
			return update_next();
		return update_default();
	}

	function click_update_email_list(value) {
		if (value === "cur" || value === "reset") {
			m_first_item = null;
			m_last_item = null;
			m_id_list = [ ];
			if (value === "reset") {
				reset_column_inputs();
				return;
			}
		}
		m_timer.start();
		try {
			handle_post_request(value)
		} catch (error) {
			console.log("caught error after handle_post_request");
			err_disp("click_update_email_list: "+error.stack);
		}
	}

	/*
	* Render the email html page in a safeish manner
	*/
	function HtmlRenderer({ htmlContent }) {
		const sanitizedHtml = DOMPurify.sanitize(htmlContent);
		return (
			<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
		);
	}

	/*
	* For some reason, DatePicker is not importing quite correctly and requires DatePicker.default
	* However, Jest expects it to function normally
	* This function ensures both works
	*/
	const fix_date_picker = (R_DATE_PICKER, date_selected_end, set_date_end) => {
		if (R_DATE_PICKER.default) {
			return (
				<R_DATE_PICKER.default className="input_columns" selected={date_selected_end} onChange={set_date_end} />
			);
		}
		return (
				<R_DATE_PICKER className="input_columns" selected={date_selected_end} onChange={set_date_end} />
		);
	};

	/*
	* Determine what the height should be for the list display
	*/
	function determine_list_height() {
		let ratio = 850/900;
		let nw = ratio*(window_dim.height - 240);
		if (nw < 140)
			nw = 140;
		return nw+"px";
	}

	return (
		<main data-testid="app-main">
			{loading === true ? (
				<div>
					<h1>Loading..</h1>
				</div>
			) : (
		<div className="r_commands">
			<R_COMMANDS onChildClick={click_update_email_list}/>
			<br />
			<br />
			<pre> From                                                 To                                                   Subject</pre>
			<input className="input_columns" type="text" name="from" value={form.from} onChange={handle_change}/>
			<input className="input_columns" type="text" name="to" value={form.to} onChange={handle_change}/>
			<input className="input_columns_last" type="text" name="subject" value={form.subject} onChange={handle_change}/>
			<br/>
			<br/>
			<pre> Start Date                                           End Date</pre>
				{fix_date_picker(R_DATE_PICKER, date_selected_start, set_date_start)}
				{fix_date_picker(R_DATE_PICKER, date_selected_end, set_date_end)}
			<br/>
			<br/>
				<div style={{
					width:		'1800px',
					height:		determine_list_height(),
					overflowY:	'scroll',
					padding:	'0px 0px'
				}}>
				<div className="r_list_display">
					<R_LIST_DISPLAY click_select_email={click_select_email} items={contacts} title="" />
				</div>
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
