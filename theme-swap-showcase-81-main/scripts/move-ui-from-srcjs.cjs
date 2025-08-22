/* eslint-disable */
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

async function ensureDir(dir) {
	await fsp.mkdir(dir, { recursive: true });
}

async function listFiles(dir) {
	try {
		const names = await fsp.readdir(dir);
		return names.map((name) => path.join(dir, name));
	} catch (err) {
		return [];
	}
}

async function copyUISrcFromCompiled() {
	const projectRoot = path.resolve(__dirname, '..');
	const srcJsDir = path.join(projectRoot, 'src-js');
	const uiDir = path.join(projectRoot, 'src', 'components', 'ui');
	const tsconfigConvert = path.join(projectRoot, 'tsconfig.convert.json');

	if (!fs.existsSync(srcJsDir)) {
		console.error('src-js not found at', srcJsDir);
		process.exit(1);
	}
	if (!fs.existsSync(uiDir)) {
		console.error('UI directory not found at', uiDir);
		process.exit(1);
	}

	await ensureDir(uiDir);
	const compiled = await listFiles(srcJsDir);
	for (const file of compiled) {
		if (!file.endsWith('.jsx') && !file.endsWith('.js')) continue;
		const target = path.join(uiDir, path.basename(file));
		await fsp.copyFile(file, target);
		console.log('Copied', path.relative(projectRoot, target));
	}

	// Remove originals in UI: .ts / .tsx
	const uiFiles = await listFiles(uiDir);
	for (const file of uiFiles) {
		if (file.endsWith('.ts') || file.endsWith('.tsx')) {
			await fsp.unlink(file);
			console.log('Removed', path.relative(projectRoot, file));
		}
	}

	// Cleanup temp artifacts
	if (fs.existsSync(tsconfigConvert)) {
		await fsp.unlink(tsconfigConvert);
		console.log('Deleted', path.relative(projectRoot, tsconfigConvert));
	}
	if (fs.existsSync(srcJsDir)) {
		await fsp.rm(srcJsDir, { recursive: true, force: true });
		console.log('Deleted', path.relative(projectRoot, srcJsDir));
	}
}

copyUISrcFromCompiled().catch((err) => {
	console.error(err);
	process.exit(1);
});


