import '@testing-library/jest-dom';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import App from '../App.mjs';
import { enableFetchMocks } from 'jest-fetch-mock'
import { act } from 'react-test-renderer';

enableFetchMocks()

jest.mock("postal-mime/src/postal-mime.js", () => {
	return "hello there!";
});

jest.mock("react-datepicker/dist/react-datepicker.css", () => {
	return "body { color: blue; }";
});

global.window.open = jest.fn(() => {
	return null;
});

global.fetch = jest.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve( 
			{
				"eid": 100, 
				"em_body": "message body",
				"em_from": "from of message",
				"em_to": "to of message",
				"em_subject": "subject of message",
				"received": "date of message"
			},
			{
				"eid": 120, 
				"em_body": "body2",
				"em_from": "from2",
				"em_to": "to2",
				"em_subject": "subject2",
				"received": "date"
			}
		),
		text: () => Promise.resolve(JSON.stringify([
			{
				"eid": 100, 
				"em_body": "message body",
				"em_from": "from of message",
				"em_to": "to of message",
				"em_subject": "subject of message",
				"received": "date of message"
			},
			{
				"eid": 120, 
				"em_body": "body2",
				"em_from": "from2",
				"em_to": "to2",
				"em_subject": "subject2",
				"received": "date"
			}
		])),
		ok: () => Promise.resolve(JSON.stringify([
			{
				"eid": 100, 
				"em_body": "message body",
				"em_from": "from of message",
				"em_to": "to of message",
				"em_subject": "subject of message",
				"received": "date of message"
			},
			{
				"eid": 120, 
				"em_body": "body2",
				"em_from": "from2",
				"em_to": "to2",
				"em_subject": "subject2",
				"received": "date"
			}
		])),
	})
);

beforeEach(() => {
  fetch.mockClear();
});

afterEach(() => {
	cleanup();
});

describe("App", () => {
test("UT check button_reset", async () => {
	await act(async() => {
		render(<App />);
	});
	const button_element = screen.getByTestId("r_command_reset");
	await act(async() => {
		button_element.click();
	});
	expect(button_element).toBeValid();
});

test("UT check button_next", async () => {
	await act(async() => {
		render(<App />);
	});
	const button_element = screen.getByTestId("r_command_next");
	await act(async() => {
		button_element.click();
	});
	expect(button_element).toBeValid();
});

test("UT check button_prev", async () => {
	await act(async() => {
		render(<App />);
	});
	const button_element = screen.getByTestId("r_command_prev");
	await act(async() => {
		button_element.click();
	});
	expect(button_element).toBeValid();
});

test("UT check r_list_display popup", async () => {
	await act(async() => {
		render(<App />);
	});
	const button_element = screen.getByTestId("r_list_display-button-100");
	await act(async() => {
		button_element.click();
	});
	expect(button_element).toBeValid();
});

test("UT check bad response", async () => {
	jest.clearAllMocks();
	const console_spy = jest.spyOn(console, "log");
	global.fetch = jest.fn(() =>
		Promise.resolve({
			json: () => Promise.resolve(JSON.stringify(
				{
				}
			)),
		})
	);
	await act(async() => {
		render(<App />);
	});
	expect(console_spy).toHaveBeenCalledWith(expect.stringContaining("TypeError: response.text is not a function"));
});

test("UT check bad SQL parsing", async () => {
	jest.clearAllMocks();
	const console_spy = jest.spyOn(console, "log");
	global.fetch = jest.fn(() =>
		Promise.resolve({
			text: () => Promise.resolve(JSON.stringify(
				{
				}
			)),
		})
	);
	await act(async() => {
		render(<App />);
	});
	expect(console_spy).toHaveBeenCalledWith(expect.stringContaining("Could not parse SQL"));
});
}) // describe
