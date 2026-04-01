/**
* Process an array of items with a concurrency limit.
* Returns results in the same order as the input.
*/
export async function processWithConcurrency<T, R>(
	items: T[],
	fn: (item: T) => Promise<R>,
	limit: number
): Promise<R[]> {
	const results: R[] = [];
	let index = 0;

	async function worker(): Promise<void> {
		while (index < items.length) {
			const i = index++;
			results[i] = await fn(items[i]);
		}
	}

	await Promise.all(
		Array.from({ length: Math.min(limit, items.length) }, () => worker())
	);
	return results;
}
