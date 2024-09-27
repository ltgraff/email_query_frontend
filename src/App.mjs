// npm start

"use client";

import React, {useState, useEffect} from 'react';

import { createRoot } from "react-dom/client";
import { StrictMode } from 'react';

import DOMPurify from 'dompurify';

import PostalMime from 'postal-mime';

import timer from "./timer.mjs";
import R_COMMANDS from "./R_COMMANDS.mjs";
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

var m_tab = null;
var m_parsed_sql = null;
var m_first_item = null;
var m_last_item = null;
var m_command = "cur";

function App() {
	const [m_contacts, set_contacts] = useState("");
	const [m_loading, set_loading] = useState(true);
	const [m_content_type, set_display] = useState(0); // 0 email, 1 sms
	const [m_display_string, set_display_string] = useState("Loading...");

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
		post_cur("email");
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
	}, [window_dim.innerWidth]);


	const m_timer = new timer();

	const window_dim_update = () => {
		window_dim_set({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	};

	function err_disp(error) {
		error_disp(error, __FILE__, err_disp_sub);
	}

	function err_disp_sub(str) {
		set_loading(true);
		console.log(str);
		set_display_string(str);
	}

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
		return 0;
	}

	function click_select_email(id) {
		open_tab();

		console.log("click_select_email");

		return post_select_email(id);
	}

	function command_build_request(cmd, message_type, message_id) {
		//cmd = "bob";

		console.log("command_build_request for: *"+cmd+"*");
		m_command = cmd;
		const post_data = {
			key1: message_type+" "+cmd,
			key2: form.to,
			key3: form.from,
			key4: form.subject,
			key5: date_selected_start,
			key6: date_selected_end,
			key7: m_first_item,
			key8: m_last_item,
			key9: message_id,
		};
		return post_data;
	}

	// Called when refreshing due to a command
	function handle_post_request(cmd, message_type, message_id) {
		const post_data = command_build_request(cmd, message_type, message_id);

		console.log("------------------> handle_post_request() m_first_item: "+m_first_item+", m_last_item: "+m_last_item);
		console.log("handle_post_request about to access /api/send-data");
		console.log("***** post_data.key1: *"+post_data.key1+"*");
		console.log("full post_data: "+JSON.stringify(post_data));

		//fetch('https://10.2.2.8:3001/api/send-data', {
			//'x-api-key': '2024_03_31-message_backend',
		fetch('http://10.2.2.8:3001/api/send-data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key':	process.env.REACT_APP_API_KEY,
			},
			body: JSON.stringify(post_data),
		})
		.then((response) => {
			console.log(".then(response)");
			if (!response.ok) {
				return (async () => {
					try {
						const err_str = await response.text();
						throw new Error(err_str);
					} catch (error) {
						err_throw("Response from fetch was not ok, and there was an error reading the error response text: "+error);
					}
				})();
			}
			return response.text();
		})
		.then((data) => {
			console.log(".then(data)");
			try {
				if (!data)
					err_throw("No data was returned from fetch");
				m_parsed_sql = JSON.parse(data);
				handle_data_from_fetch(cmd, data);
			} catch (error) {
				err_throw("Error parsing data from fetch");
			}
		})
		.catch((error) => {
			err_disp("handle_post_request, stack:\n\n"+error.stack);
		});
	}

	function handle_data_from_fetch(cmd, data) {
		if (cmd === "select") {
			update_tab();
		} else {
			if (update_email_list() < 0)
				err_throw("handle_post_request .then data");
		}
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

	function list_items_update_next() {
		let i;
		let flist = [ ];

		console.log("list_items_update_next");
		for (i=0;i<m_parsed_sql.length;i++) 
			email_add_item(flist, m_parsed_sql[i]);
		m_first_item = flist[0].id;
		if (flist.length-1 > -1)
			m_last_item = flist[flist.length-1].id;
		else
			m_last_item = m_first_item;
		set_contacts(flist);
		console.log("------------------> list_items_update_next() m_first_item: "+m_first_item+", m_last_item: "+m_last_item);
		return 1;
	}

	function list_items_update_default() {
		console.log("list_items_update_default");

		m_first_item = m_parsed_sql[0].id;
		if (m_parsed_sql.length-1 > -1)
			m_last_item = m_parsed_sql[m_parsed_sql.length-1].id;
		else
			m_last_item = m_first_item;
		set_contacts(m_parsed_sql);
		console.log("------------------> list_items_update_default() m_first_item: "+m_first_item+", m_last_item: "+m_last_item);
		return 1;
	}

	function update_email_list() {
		console.log("update_email_list");
		if (! m_parsed_sql[0]) // For prev or next that are empty, just leave everything as is
			return 0;
		console.log("update_email_list (do some work).. m_command: *"+m_command+"*");
		set_loading(false);
	
		if (m_command === "next")
			return list_items_update_next();
		return list_items_update_default();
	}

	function click_update_email_list(cmd) {

		console.log("click_update_email_list() cmd: "+cmd);


		m_timer.start();
		if (cmd === "display") {
			if (m_content_type === 0)
				set_display(1);
			else
				set_display(0);
			cmd = "reset";
		}
		if (cmd === "cur" || cmd === "reset") {
			console.log("command: "+cmd);
			m_first_item = null;
			m_last_item = null;
			if (cmd === "reset")
				reset_column_inputs();
			return post_cur("email");
		} else if (cmd === "next") {
			return post_next("email");
		} else if (cmd === "prev") {
			return post_prev("email");
		} else {
			err_throw("unknown command: "+cmd);
		}
	}

	function post_select_email(email_id) {
		return handle_post_request("select", "email", email_id);
	}

	function post_cur(message_type) {
		console.log("before handle_post_request cur");
		handle_post_request("cur", message_type, null);
		console.log("after handle_post_request cur ");
	}

	function post_prev(message_type) {
		return handle_post_request("prev", message_type, m_first_item);
	}

	function post_next(message_type) {
		return handle_post_request("next", message_type, m_last_item);
	}

	function post_select_sms() {
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
		let ratio = 710/900; // 850/900
		let nw = ratio*(window_dim.height - 240);
		if (nw < 140)
			nw = 140;
		return nw+"px";
	}

	return (
		<StrictMode>
		<main data-testid="app-main">
			{m_loading === true ? (
				<div>
					<b><pre>{m_display_string}</pre></b>
				</div>
			) : (
		<div className="R_COMMANDS">
			<p style={{fontSize: "2em"}}>Message lookup</p>
			<br />
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
					<R_LIST_DISPLAY click_select_email={click_select_email} items={m_contacts} title="" />
				</div>
				</div>
				<br/>
				<br/>
			</div>
				)
			}
		</main>
		</StrictMode>
	);
}

export default App;
