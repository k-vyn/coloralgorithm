export function endsWith(str: string, tail: string) {
	return !tail.length || str.slice(-tail.length) === tail;
}
