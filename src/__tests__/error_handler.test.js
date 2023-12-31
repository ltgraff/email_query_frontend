import '@testing-library/jest-dom';
import { error_reset, error_throw, error_set, error_append, error_disp } from "../error_handler.js";

const mocked_log = jest.spyOn(console, 'log');

mocked_log.mockImplementation(() => {});

afterAll(() => {
	mocked_log.mockRestore();
	error_reset();
});

describe('error_handler tests', () => {
	test("UT error_throw/set/disp", () => {
		let msg = "";
		let cerror = undefined;
		const err_str = "thrown error";
		try {
			error_throw("Test error");
		} catch (error) {
			msg = error.message;
			cerror = error;
			error_set(error, err_str);
		}
		expect(cerror).toBeDefined();
		error_disp(cerror, "Test error");
		expect(mocked_log).toHaveBeenCalledWith(expect.stringContaining(err_str));
		expect(msg).toEqual("Test error");
	})

	test("UT error_throw/disp normal throw", () => {
		let cerror = undefined;
		try {
			throw Error("normal throw");
		} catch (error) {
			cerror = error;
		}
		error_disp(cerror, "my_filename.js");
		expect(mocked_log).toHaveBeenCalledWith(expect.stringContaining("normal throw"));
	})

	test("UT error_append/disp", () => {
		const fn = "my_filename.js";
		error_append("append error", "/this/is/the/path/"+fn);
		error_append("append error", "\\this\\is\\the\\path\\"+fn);
		error_disp("disp error", "my_filename.js");
		expect(mocked_log).toHaveBeenCalledWith(expect.stringContaining("append error"));
		expect(mocked_log).toHaveBeenCalledWith(expect.stringContaining(fn));
		expect(mocked_log).toHaveBeenCalledWith(expect.stringContaining(fn));
	})

	test("UT error_set/disp", () => {
		const err_str = "my error";
		error_set(null, "");
		error_disp(err_str);
		expect(mocked_log).toHaveBeenCalledWith(expect.stringContaining(err_str));
	})

	test("UT error_reset/disp", () => {
		error_disp("", "");
		expect(mocked_log).toHaveBeenCalledWith(expect.stringContaining(""));
	})

	test("UT make sure error_append is being called", () => {
		const my_str = "this is my string";
		const my_fn = "my_filename.js";
		error_disp(my_str, my_fn);
		expect(mocked_log).toHaveBeenCalledWith(expect.stringContaining(my_str));
		error_reset();
	})
})
