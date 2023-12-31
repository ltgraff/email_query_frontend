import '@testing-library/jest-dom';
import STRING_SPACING from "../string_spacing.js";

test("UT string_spacing truncate value", () => {
	const disp = new STRING_SPACING();
	// total, spacing between, string_len
	disp.set_spacing([3, 0, 1, 1, 1]);
	const elemen_render = disp.spacing_display("a", "b", "cccccccc");
	const text_content = elemen_render.props.children.props.children;
	expect(text_content).toMatch("abc");
})

/*
describe('Component testing', () => {
  test('Component', () => {
    const { container } = render(<Component>I am a message</Component>);

    const {firstChild} = container 

    expect(firstChild).toMatchSnapshot();
  });
});
*/

test("UT string_spacing pad value", () => {
	const disp = new STRING_SPACING();
	// total, spacing between, string_len
	disp.set_spacing([10, 0, 1, 1, 1]);
	const elemen_render = disp.spacing_display("a", "b", "c");
	const text_content = elemen_render.props.children.props.children;
	expect(text_content).toMatch("abc       ");
})
