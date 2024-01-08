import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import R_COMMANDS from '../r_commands.mjs';

afterEach(() => {
	cleanup();
});

const click_func = jest.fn();

describe("r_commands", () => {
test("UT prev", () => {
	render(<R_COMMANDS onChildClick={click_func} />);
	const button_element = screen.getByTestId("r_command_prev");
	button_element.click();
	expect(button_element).toBeValid();
	expect(click_func).toHaveBeenCalledWith("prev");
})
	
test("UT cur", () => {
	render(<R_COMMANDS onChildClick={click_func} />);
	const button_element = screen.getByTestId("r_command_cur");
	button_element.click();
	expect(button_element).toBeValid();
	expect(click_func).toHaveBeenCalledWith("cur");
})

test("UT next", () => {
	render(<R_COMMANDS onChildClick={click_func} />);
	const button_element = screen.getByTestId("r_command_next");
	button_element.click();
	expect(button_element).toBeValid();
	expect(click_func).toHaveBeenCalledWith("next");
})

test("UT reset", () => {
	render(<R_COMMANDS onChildClick={click_func} />);
	const button_element = screen.getByTestId("r_command_reset");
	button_element.click();
	expect(button_element).toBeValid();
	expect(click_func).toHaveBeenCalledWith("reset");
})
}) // describe
