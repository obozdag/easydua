export async function loadText(path)
{
	try {
		const response = await fetch(path, { credentials: 'same-origin' });

		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		return await response.text();
	} catch (error) {
		console.error(`Failed to load ${path}`, error);
		return null;
	}
}
