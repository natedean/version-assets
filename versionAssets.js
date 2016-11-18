const fs = require('fs');
const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
const distDir = 'dist';
const filePaths = ['bundle.js','style.css'];

// run
renameFiles(filePaths, version);
interpolateVersionInHtml(setupWriteFile(filePaths, version));

function renameFiles(filePaths, version) {
	filePaths.forEach(x => {
		const fileData = getSplitNameExt(x);

		fs.renameSync(`${distDir}/${x}`, `${distDir}/${fileData.name}.${version}.${fileData.ext}`, errHandler);
	});
}

function interpolateVersionInHtml(writeFile) {
	fs.readFile(`${distDir}/index.html`, 'utf-8', writeFile);
}

function setupWriteFile(filePaths, version) {
	return (err, contents) => {
		if (err) throw err;

		filePaths.forEach(x => {
			const fileData = getSplitNameExt(x);
			const regex = new RegExp(x, 'g');
			contents = contents.replace(regex, `${fileData.name}.${version}.${fileData.ext}`);
		});

		fs.writeFile(`${distDir}/index.html`, contents, (err) => { if (err) throw err; });
	}
}

function errHandler(err){ if (err) throw err;  }

function getSplitNameExt(x){
	const data = x.split('.');
	return {
		name: data[0],
		ext: data[1]
	}
}

