import styles from "./page.module.css";

export default async function Page() {
	// Defining the first API
	const COLOR_MIND_API = `http://colormind.io/api/`;

	const colormindResponse = await fetch(COLOR_MIND_API, {
		method: "POST",
		body: JSON.stringify({ model: "default", input: [[255, 255, 255]] }),
	});
	const colormindData = await colormindResponse.json();

	console.log(colormindData);

	const palette = colormindData.result;

	console.log(palette);

	// to convert the rgb data to hex bc the Europeana takes hex colors
	const rgbToHex = (rgb) => {
		return `%23${rgb
			.map((value) => {
				const quotient = Math.floor(value / 16); // first hex digit
				const remainder = value % 16; // second hex digit

				// Step 2: Convert quotient and remainder to hex (0-9, A-F)
				const hex = quotient.toString(16) + remainder.toString(16);

				// Return the two-digit hex value for each component
				return hex;
			})
			.join("")}`;
	};
	const firstColorHex = rgbToHex(palette[0]); // Convert the first color in the palette to hex

	const secondColorHex = rgbToHex(palette[1]); // Convert the first color in the palette to hex
	console.log(firstColorHex);
	console.log(secondColorHex);

	// Defining the second API

	const EUROPEANA_API = `https://api.europeana.eu/record/v2/search.json?wskey=ardodempki&query=*:*&colourpalette=${firstColorHex}&colourpalette=${secondColorHex}&thumbnail=true`;

	// Fetch data from the Europeana API using the color information (modify as needed)
	const europeanaResponse = await fetch(EUROPEANA_API);
	const europeanaData = await europeanaResponse.json();

	console.log(palette[0]);

	// Rendering the Europeana results
	return (
		<div className={styles.page}>
			<h1>Europeana Results Based on Colormind Palette</h1>
			<div className={styles.palette}>
				<h2>Color Palette:</h2>
				<div className={styles.square}> </div>
				<div className={styles.square}> </div>
			</div>
			<div className={styles.layout}>
				{europeanaData.items.map((item, index) => (
					<div
						key={index}
						className={styles.artifact}
					>
						<img
							src={item.edmPreview[0]}
							alt={item.title[0]}
							className={styles.pic}
						/>
						<h2>{item.title[0]}</h2>
						<p>{item.dataProvider}</p>
					</div>
				))}
			</div>
		</div>
	);
}
