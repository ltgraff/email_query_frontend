import React, {useState, useEffect} from 'react';
import DOMPurify from 'dompurify';
import Rcomponent from './Rcomponent';
import ReactDOM from 'react-dom';
import './App.css';

function App() {
	const [contacts, set_contacts] = useState(["hiya! this is the initial state"]);
	const [loading, set_loading] = useState(true);
	useEffect(() => {
		display_update();
	}, []);

	const [m_display_string, set_display_string] = useState("");
	//const [m_email_amount, set_email_amount] = useState(10);

const [m_slider_value, setSliderValue] = useState(50); // Initial value of the slider

  // Function to handle slider value changes
  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
	  m_email_amount = event.target.value;
	  set_display_string("");
	  display_update();
  };

	var m_email_amount = 50;
	var m_tab = null;

	function display_update() {
		fetch('http://localhost:3001').then(response => {
			return response.text();
		})
		.then((data) => {
			set_loading(false);
			let tmp = JSON.parse(data);

			// select em_from, em_to, em_subject, received, eid from email_message order by received desc limit 10;
			tmp = tmp.slice(0, m_email_amount).map((item, index) => {
				const arg = [
					190, 8,
					item.em_from, 45,
					item.em_to, 45,
					item.em_subject, 55,
					item.received, 35,
				];
				const spacing_result = string_spacing(...arg);
				return (
						<button key={index} style={{fontSize: '12px', height: '25px', verticalAlign: 'bottom', padding: 0, marginBottom: '10px', lineHeight: '1px'}} onClick={() => click_select_email(item.em_body)}>
							{spacing_result}
						</button>
				);
			});
			set_contacts(tmp);
		});
	}
	
	function click_change_amount(value) {
		m_email_amount = value;
		display_update();
	}

	function click_select_email(em_body) {
		const content = (
			<div id="root">
			    <h1>Hello from the new tab!</h1>
				<p>This is your content.</p>
			</div>
		);


		if (m_tab === null) {
			m_tab = window.open('', '_blank');
			m_tab.addEventListener('load', () => {
				alert("EVENT LISTENER WORKED!");
				console.log('New tab loaded');
				const targetElement = m_tab.document.getElementById('root');
				if (targetElement) {
					console.log('Target element found:', targetElement);
					// Render the React component in the target element
					ReactDOM.render(content, targetElement);
				} else {
					console.error('Target element not found');
				}
			})
			return;
		}
		console.log('tab should be up');
		const targetElement = m_tab.document.querySelector('#root');//m_tab.document.getElementById('root');
		if (targetElement) {
			console.log('Target element found:', targetElement);
			// Render the React component in the target element
			ReactDOM.render(content, targetElement);
		} else {
			console.error('Target element NOT found.. but it should be ready??');
		}
	}
	
	function slim_string(str, len, pad) {
		var tmp;

		len-=pad;
		if (typeof(str) !== 'string')
			tmp = ""+str;
		else
			tmp = str;
		if (tmp.length > len)
			tmp = tmp.substring(0, len);
		if (tmp.length < len+pad) {
			for (let i=tmp.length;i<len+pad;i++)
				tmp+=" ";
		}
		return tmp;
	}
	
	function HtmlRenderer({ htmlContent }) {
		const sanitizedHtml = DOMPurify.sanitize(htmlContent);
		return (
			<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
		);
	}


	// 0:	total str size
	// 1:	padding between strings
	// 2:	str
	// 3:	str_len
	// 4:	str
	// 5:	str_len
	function string_spacing() {
		var disp = "";
		var i, q;

		for (i=2, q=3;i<arguments.length;i+=2, q+=2)
			disp += slim_string(arguments[i], arguments[q], arguments[1]);
		for (i=disp.length;i<arguments[0];i++)
			disp+=" ";
		return (
			<>
			<pre>
			{disp}
			</pre>
			</>
		);
	}

	const arg = [
		190, 8,
		"From", 45,
		"To", 45,
		"Subject", 55,
		"Date Received", 35
	];
	return (
		<main>
			{loading === true ? (
				<div>
					<h1>Loading..</h1>
				</div>
			) : (

		<div className="slidecontainer">
			<input 
				type="range"
				min="1"
				max="50"
				value={m_slider_value} // Bind the value to the 
				onChange={handleSliderChange} // Handle changes to the slider
				className="slider"
				id="myRange"
			/>
			<p>
				Value: {m_slider_value}
			</p>
			<Rcomponent onChildClick={click_change_amount}/>
				<b>
					{string_spacing(...arg)}
				</b>
				<div style={{
					width:		'1500px',
					height:		'130px',
					overflowY:	'scroll',
					padding:	'0px 0px'
				}}>
					{contacts}
				</div>
				<br/>
				<br/>
				<div style={{
					width:		'1500px',
					height:		'600px',
					overflowY:	'scroll',
					padding:	'0px 0px'
				}}>
				<HtmlRenderer htmlContent={m_display_string} />
				</div>
			</div>
				)
			}
		</main>
	);
}

export default App;
