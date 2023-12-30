import '@testing-library/jest-dom';
import R_LIST_DISPLAY from '../r_list_display.js';
import { render, screen, cleanup } from '@testing-library/react';

//	screen.debug();

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

const my_func = jest.fn();

test("UT r_list_display with null contacts value", () => {
	const bad_contacts = null;
	render(<R_LIST_DISPLAY click_select_email={my_func} items={bad_contacts} title="" />);
	const elem = screen.getByTestId("r_list_display-test");
	expect(elem).toBeInTheDocument();
})

test("UT r_list_display with incorrect contacts type", () => {
	const bad_contacts = "not an array";
	render(<R_LIST_DISPLAY click_select_email={my_func} items={bad_contacts} title="" />);
	const elem = screen.getByTestId("r_list_display-test");
	expect(elem).toBeInTheDocument();
})

test("UT r_list_display main element", () => {
	render(<R_LIST_DISPLAY click_select_email={my_func} items={contacts} title="" />);
	const elem = screen.getByTestId("r_list_display-test");
	expect(elem).toBeInTheDocument();
})

test("UT r_list_display button functionality", () => {
	render(<R_LIST_DISPLAY click_select_email={my_func} items={contacts} title="" />);
	const elem = screen.getByTestId("r_list_display-button-9");
	expect(elem).toBeInTheDocument();
	expect(elem).toHaveTextContent("testfrom@yahoo.com");
	expect(elem).toHaveTextContent("testto@yahoo.com");
	expect(elem).toHaveTextContent("the subject");
	expect(elem).toHaveTextContent("date received");
})

test("IT between elements in R_LIST_DISPLAY component", () => {
	render(<R_LIST_DISPLAY click_select_email={my_func} items={contacts} title="" />);
	const main_element = screen.getByTestId("r_list_display-test");
	const button_element = screen.getByTestId("r_list_display-button-9");
	expect(main_element).toBeInTheDocument();
	expect(button_element).toBeInTheDocument();
	button_element.click();
	expect(my_func).toHaveBeenCalled();
})
