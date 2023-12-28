import '@testing-library/jest-dom';
import R_LIST_DISPLAY from '../r_list_display.js';
import { render, screen } from '@testing-library/react';

function my_func() {
	return (<div>return value</div>);
}

test("should render", () => {
	let contacts = [{
		eid: "9",
		em_from: "testfrom@yahoo.com",
		em_to: "testto@yahoo.com",
		em_subject: "the subject",
		received: "date received",
		em_body: "body"
	}];

	render(<R_LIST_DISPLAY click_select_email={my_func} items={contacts} title="" />);

//	screen.debug();

	const elem = screen.getByTestId("r_list_display-button-9");
	expect(elem).toBeInTheDocument();

	expect(elem).toHaveTextContent("testfrom@yahoo.com");
	expect(elem).toHaveTextContent("testto@yahoo.com");
	expect(elem).toHaveTextContent("the subject");
	expect(elem).toHaveTextContent("date received");
})
