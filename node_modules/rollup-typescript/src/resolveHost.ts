import * as fs from 'fs';

export function readFile(fileName: string) {
	return fs.readFileSync(fileName, 'utf8');
}

export function directoryExists(dirPath: string) {
	try {
		return fs.statSync(dirPath).isDirectory();
	} catch {
		return false;
	}
}

export function fileExists(filePath: string) {
	try {
		return fs.statSync(filePath).isFile();
	} catch {
		return false;
	}
}
