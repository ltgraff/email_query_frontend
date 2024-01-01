import '@testing-library/jest-dom';
import STRING_SPACING from "../string_spacing.mjs";

describe("string_spacing tests", () => {

test("UT string_spacing truncate value", () => {
	const disp = new STRING_SPACING();
	// total, spacing between, string_len
	disp.set_spacing([3, 0, 1, 1, 1]);
	const elemen_render = disp.spacing_display("a", "b", "cccccccc");
	const text_content = elemen_render.props.children.props.children;
	expect(text_content).toMatch("abc");
})

test("UT string_spacing pad value", () => {
	const disp = new STRING_SPACING();
	// total, spacing between, string_len
	disp.set_spacing([10, 0, 1, 1, 1]);
	const elemen_render = disp.spacing_display("a", "b", "c");
	const text_content = elemen_render.props.children.props.children;
	expect(text_content).toMatch("abc       ");
})

}) // describe
