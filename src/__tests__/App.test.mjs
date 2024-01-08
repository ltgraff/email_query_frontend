import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import App from '../App.mjs';
import { enableFetchMocks } from 'jest-fetch-mock'
import { act } from 'react-test-renderer';

enableFetchMocks()

//jest.mock("react-datepicker", () => {
//	return "<div>my component</div>";
//});

//jest.mock("fetch", () => {
//	return "1,2,3";
//});

//import "react-datepicker/dist/react-datepicker.css";

jest.mock("react-datepicker/dist/react-datepicker.css", () => {
	return "body { color: blue; }";
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
		}
	)
  })
);

beforeEach(() => {
  fetch.mockClear();
});

afterEach(() => {
	cleanup();
});

const click_func = jest.fn();

describe("App", () => {
test("UT check loading page", () => {
	render(<App/>);
	const elem = screen.getByTestId("app-main");
	expect(elem).toHaveTextContent("Load");
})

/*test("UT App", async () => {
	await act( async () => render(<App/>));
})*/
}) // describe
