import timer from "../timer.mjs";

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("timer tests", () => {
	test("UT get_elapsed_milli at 3 milliseconds", async () => {
		let tmp = new timer();
		tmp.start();
		await sleep(30);
		tmp.stop();
		expect(tmp.get_elapsed_milli()).toBeGreaterThanOrEqual(25);
	})
	test("UT get_elapsed_seconds at 1 second", async () => {
		let tmp = new timer();
		tmp.start();
		await sleep(1100);
		tmp.stop();
		expect(tmp.get_elapsed_seconds()).toBeGreaterThanOrEqual(1);
	})
	test("UT timer restart and stop timer", async () => {
		let tmp = new timer();
		tmp.start();
		await sleep(5);
		tmp.restart();
		tmp.stop();
		expect(tmp.get_elapsed_seconds()).toBeGreaterThanOrEqual(0);
	})
	test("UT timer restart and keep timer running", async () => {
		let tmp = new timer();
		tmp.start();
		await sleep(5);
		tmp.restart();
		expect(tmp.get_elapsed_seconds()).toBeGreaterThanOrEqual(0);
	})
})
