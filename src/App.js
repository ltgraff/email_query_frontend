// npm start

import React, {useState, useEffect} from 'react';
import DOMPurify from 'dompurify';

import timer from './timer.js';
import R_COMMANDS from './r_commands';
import R_LIST_DISPLAY from './r_list_display';

import './App.css';

import { error_throw, error_set, error_append, error_disp } from './error_handler.js';

function err_throw(error) {
	return error_throw(error, import.meta.url);
}

function err_set(error) {
	return error_set(error, import.meta.url);
}

function err_append(error) {
	return error_append(error, import.meta.url);
}

function err_disp(error) {
	return error_disp(error, import.meta.url);
}

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
	const [m_date_start, setDateStart] = useState("");
	const [m_date_end, setDateEnd] = useState("");
	const [m_from, setFrom] = useState("");
	const [m_to, setTo] = useState("");
	const [m_subject, setSubject] = useState("");
	useEffect(() => {
		display_update();
		// Disable useEffect dependency warning
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	var m_display_string = "";

	const m_timer = new timer();

/*
	var g_err_str = "";
	var g_error_stack = "";

	function err_throw(error) {
		err_append(error);
		throw new Error(error);
	}

	function err_set(error) {
		g_error_stack = error.stack;
		if (!g_error_stack)
			g_error_stack = "";
		return err_append(error);
	}

	function err_append(err_str) {
		g_err_str += err_inner(err_str);
		return -1;
	}

	function err_disp(error) {
		if (typeof(error) === 'object' && error && error.stack) {
			if (g_error_stack.length < 1)
				g_error_stack = error.stack;
		} else if (typeof(error) === 'string') {
			err_append(error);
		}
		//g_error_stack = "";
		if (g_error_stack.length > 0)
			err_append(g_error_stack);
		console.log(g_err_str);
		g_err_str = "";
		g_error_stack = "";
		return -1;
	}

	function err_inner(err_str) {
		let tmp = "";
		let d = new Date();
		tmp = d.toString().slice(4, 24)+" "+__filename+": "+err_str+"\n";
		return tmp;
	}
*/


	/*
	var g_err_str = "";
	var g_error_stack = "";

	function err_set(err_str) {
		try {
			throw new Error(err_str);
		} catch (error) {
			g_error_stack = error.stack;
			return err_append(error);
		}
	}

	function err_append(err_str) {
		g_err_str += err_inner(err_str);
		return -1;
	}

	function err_disp(err_str) {
		err_append(err_str);
		err_append(err_str.stack);
		console.log(g_err_str+g_error_stack);
		return -1;
	}

	function err_inner(err_str) {
		let tmp = "";
		let d = new Date();
		tmp = d.toString().slice(4, 24)+" "+__filename+": "+err_str+"\n";
		return tmp;
	}
*/
	function reset_column_inputs() {
		setFrom("");
		setTo("");
		setSubject("");
		setDateStart("");
		setDateEnd("");
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

	function inner_func() {
		err_set("initial failure");
	}

	function simple_failed_function() {
		if (inner_func() < 0)
			return err_append("(in simple_failed_function)");
		return 0;
	}

	// Called during refresh of page and inital loading
	function display_update() {
		let dtmp = new timer();
		let ftmp = new timer();

		//if (simple_failed_function() < 1)
		//	return err_disp("display_update 1");

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
			//if (!m_parsed_sql || !m_parsed_sql[0])
			//	err("Data from the website gave an error");
			if (update_email_list() < 0)
				err_throw("display_update: update_email_list");
				//console.log("display_update error!");

			dtmp.stop();

			console.log("fetch timer: \t\t"+ftmp.get_elapsed_milli()+"        .then data timer: \t"+dtmp.get_elapsed_milli());
		})
		.catch(error => {
			err_disp(error);
			//console.log(err("An error occurred in display_update: "+error.stack));
		});
	}

	// Called when refreshing due to a command
	function handle_post_request(cmd) {
		let tmp1 = new timer();
		let tmp2 = new timer();

		tmp1.start();

		m_command = cmd;
		const postData = {
			key1: m_command,
			key2: m_to,
			key3: m_from,
			key4: m_subject,
			key5: m_date_start,
			key6: m_date_end,
			key7: m_first_item,
			key8: m_last_item,
			key9: m_id_list,
		};

		if (m_command === "cur")

		console.log("to: *"+m_to+"* from: *"+m_from+"*")
		console.log("first: *"+m_first_item+"* last: *"+m_last_item+"*")

		fetch('http://localhost:3001/api/send-data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Specify the content type
			},
			body: JSON.stringify(postData), // Convert data to JSON format
		})
		.then((response) => {
			console.log("(in .then response)");
			tmp1.stop();
			tmp2.start();

			if (!response.ok) ////////////// here
				err_throw("handle_post_request .then response is not ok");
				//throw new Error("network response .then response failed");
				//return Promise.reject("network response .then response: ");
			if (update_email_list() < 0)
				err_throw("handle_post_request .then response");
			return response.text();
		})//, promise_error("failed promise chain 2"))
		.then((data) => {
			console.log("(in .then data)");
			tmp2.stop();
			m_parsed_sql = JSON.parse(data);
			if (update_email_list() < 0)
				err_throw("handle_post_request .then data");

			//query_str.query to db_query.qstr

			m_timer.stop();

			console.log("fetch to .then: \t"+tmp1.get_elapsed_milli());
			console.log(".then to data: \t\t"+tmp2.get_elapsed_milli());
			console.log("Total timer from: \t"+m_timer.get_elapsed_milli());
			console.log(" ");
			console.log(" ");
		})
		.catch((error) => {
			err_disp(error);
			//promise_error(error);
			//return err_set("promise chain in .catch(error)");
			//console.log(err("catch: "+error+": "+error.stack));
		});
		return 0;
	}

	function promise_error(error) {
		console.log("---");
		console.log("in promise_error: "+error+", and stack: "+error.stack);
		console.log("---\n");
		throw (error);
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
		m_first_item = m_parsed_sql[0].received;
		if (m_parsed_sql.length-1 > -1)
			m_last_item = m_parsed_sql[m_parsed_sql.length-1].received;
		else
			m_last_item = m_first_item;
		set_contacts(m_parsed_sql);
		return 1;
		//return err_set("update_default: early exit");
	}

	function update_email_list() {
		if (! m_parsed_sql[0]) {
			set_contacts("");
			return err_set("update_email_list: returned sql is null");
		}
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

	return (
		<main>
			{loading === true ? (
				<div>
					<h1>Loading..</h1>
				</div>
			) : (
		<div className="r_commands">
			<R_COMMANDS onChildClick={click_update_email_list}/>
			<br />
			<br />
			<input className="input_columns" type="text" value={m_from} onChange={(e) => setFrom(e.target.value)}/>
			<input className="input_columns" type="text" value={m_to} onChange={(e) => setTo(e.target.value)}/>
			<input className="input_columns_last" type="text" value={m_subject} onChange={(e) => setSubject(e.target.value)}/>
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
		{"first: "+m_from} {m_to} {m_subject}
		</main>
	);
}

export default App;
