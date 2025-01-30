// Generates a random string for id's etc.

export function createId() {
	return Math.random().toString(36).slice(2);
}