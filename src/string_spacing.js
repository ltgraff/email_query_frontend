//const defs = [190, 8, 45, 45, 55, 30];

class string_spacing {
	constructor() {
		this.spacing = [ ];
	}

	// Pass a list of spacing parameters
	// Until changed, these will be the spacing parameters used
	set_spacing() {
		for (let i=0;i<arguments[0].length;i++)
			this.spacing.push(arguments[0][i]);
	}

	// Ensure each argument takes up a certain amount of space, to ensure text lines up
	// 0:	total str size
	// 1:	padding between strings
	// 2:	str
	// 3:	str_len
	// 4:	str
	// 5:	str_len
	spacing_display() {
		let ret = "";
		let i;

		for (i=0;i<arguments.length;i++)
			ret += this.slim_string(arguments[i], this.spacing[i+2], this.spacing[1]);
		for (i=ret.length;i<this.spacing[0];i++)
			ret+=" ";
		return (
			<>
			<pre>
			{ret}
			</pre>
			</>
		);
	}

	// Make sure a string is padded to the correct amount
	slim_string(str, len, pad) {
		// Convert non-string values to strings
		str = String(str);

		// Truncate the string to the specified length
		if (str.length > len) 
			str = str.substring(0, len);

		// Pad the string with spaces to the specified length
		while (str.length < len + pad) 
			str += ' ';

		return str;
	}
}

export default string_spacing;
