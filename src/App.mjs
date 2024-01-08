// npm start

import React, {useState, useEffect} from 'react';
import DOMPurify from 'dompurify';

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

	var m_display_string = "";

	const m_timer = new timer();

	function reset_column_inputs() {
		set_form(form_initial_state);
		set_date_start("");
		set_date_end("");
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
		}
		m_tab.document.body.innerHTML = em_body;
	}

	// Called during refresh of page and inital loading
	function display_update() {
		let dtmp = new timer();
		let ftmp = new timer();

		console.log("display_update");

		ftmp.start();

		fetch('http://localhost:3001').then(response => {
			ftmp.stop();
			dtmp.start();

			let tmp = response.text();

			console.log("response from fetch: "+tmp);
			return tmp;
		})
		.then((data) => {
			set_loading(false);
			console.log(data);
			m_parsed_sql = JSON.parse(data);
			if (!m_parsed_sql || !m_parsed_sql[0])
				err_throw("display_update: Could not parse SQL");
			if (update_email_list() < 0)
				err_throw("display_update: update_email_list failed");

			dtmp.stop();

			console.log("fetch timer: \t\t"+ftmp.get_elapsed_milli()+"        .then data timer: \t"+dtmp.get_elapsed_milli());
		})
		.catch(error => {
			err_disp(error);
		});
	}

	// Called when refreshing due to a command
	function handle_post_request(cmd) {
		let tmp1 = new timer();
		let tmp2 = new timer();

		tmp1.start();

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

		console.log("to: *"+form.to+"* from: *"+form.from+"*")
		console.log("first: *"+m_first_item+"* last: *"+m_last_item+"*")

		fetch('http://localhost:3001/api/send-data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(post_data),
		})
		.then((response) => {
			tmp1.stop();
			tmp2.start();

			if (!response.ok)
				err_throw("handle_post_request received bad response");
			//if (update_email_list() < 0)
			//	err_throw("handle_post_request .then response");
			return response.text();
		})
		.then((data) => {
			console.log("(in .then data)");
			tmp2.stop();
			m_parsed_sql = JSON.parse(data);
			if (update_email_list() < 0)
				err_throw("handle_post_request .then data");

			m_timer.stop();

			console.log("fetch to .then: \t"+tmp1.get_elapsed_milli());
			console.log(".then to data: \t\t"+tmp2.get_elapsed_milli());
			console.log("Total timer from: \t"+m_timer.get_elapsed_milli());
			console.log(" ");
			console.log(" ");
		})
		.catch((error) => {
			err_disp(error);
		});
		return 0;
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

	function get_all_prototypes(cls) {
		let ret = "";
		try {
			ret += Object.getOwnPropertyNames(cls.prototype).join("\n");
		} catch (error) {
			try {
				ret += Object.getOwnPropertyNames(cls).join("\n");
			} catch (error) {
				ret = "<Could not get class prototypes>";
			}
		}
		return ret;
	}

	function get_object_data(cls) {
		try {
			var tmp = new cls();
		} catch (error) {
			return "<Could not create object via constructor>";
		}
		const tmp_keys = Object.keys(tmp);
		return tmp_keys.join("\n");
	}

	function get_class_functions(cls) {
		let tmp = cls;
		let cls_funcs = [ ];
		for (var id in tmp) {
			try {
				cls_funcs.push(id + ": " + tmp[id].toString());
			} catch (error) {
				cls_funcs.push(id + ": inaccessible");
			}
		}
		if (cls_funcs.length < 1)
			return "<class function information not found>";
		return cls_funcs.join("\n");
	}

	function analyze_class(cls) {
		let ret = "";

		ret = "data:\n-----------\n";
		ret += get_object_data(cls);
		ret += "\n-----------\n\n";

		ret += "prototypes:\n-----------\n";
		ret += get_all_prototypes(cls);
		ret += "\n-----------\n\n";

		ret += "functions:\n-----------\n";
		ret += get_class_functions(cls);
		ret += "\n-----------\n";
		return ret;
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
			<R_DATE_PICKER.default className="input_columns" selected={date_selected_start} onChange={set_date_start}/>
			<R_DATE_PICKER.default className="input_columns" selected={date_selected_end} onChange={set_date_end}/>
			<br/>
			<br/>
				<div style={{
					width:		'1520px',
					height:		'550px',
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
