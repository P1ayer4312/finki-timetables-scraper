import fs from 'node:fs';
import fetchData from './src/fetchData.js';

// Example
async function main() {
	const data = await fetchData();
	fs.writeFileSync('parsed_lectures.json', JSON.stringify(data));
}

main();