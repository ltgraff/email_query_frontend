class timer {
	constructor() {
		this.m_start = 0;
		this.m_stop = 0;
		this.m_running = false;
	}

	start() {
		this.m_running = true;
		this.m_start = Date.now();
	}

	stop() {
		this.m_stop = Date.now();
		this.m_running = false;
	}

	get_elapsed(conv) {
		let elapsed;

		if (this.m_running)
			elapsed = Date.now() - this.m_start;
		else 
			elapsed = this.m_stop - this.m_start;
		return elapsed/conv;
	}

	get_elapsed_milli() {
		return this.get_elapsed(1);
	}

	get_elapsed_seconds() {
		return this.get_elapsed(1000);
	}
}

export default timer;
