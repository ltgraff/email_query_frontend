import '@testing-library/jest-dom';
import R_LIST_DISPLAY from '../r_list_display.js';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(() => {
	cleanup();
});

var contacts = [{
	eid: "9",
	em_from: "testfrom@yahoo.com",
	em_to: "testto@yahoo.com",
	em_subject: "the subject",
	received: "date received",
	em_body: "body"
}];

function my_func() {
	return (<div>return value</div>);
}

test("should render", () => {
	render(<R_LIST_DISPLAY click_select_email={my_func} items={contacts} title="" />);

//	screen.debug();
	const elem = screen.getByTestId("r_list_display-test");
	expect(elem).toBeInTheDocument();
})

test("check button functionality", () => {
	render(<R_LIST_DISPLAY click_select_email={my_func} items={contacts} title="" />);

	const elem = screen.getByTestId("r_list_display-button-9");
	expect(elem).toBeInTheDocument();

	expect(elem).toHaveTextContent("testfrom@yahoo.com");
	expect(elem).toHaveTextContent("testto@yahoo.com");
	expect(elem).toHaveTextContent("the subject");
	expect(elem).toHaveTextContent("date received");
})
