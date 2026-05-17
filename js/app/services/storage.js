export function loadValue(key, fallback = null)
{
	try {
		const value = localStorage.getItem(key);
		return value === null ? fallback : value;
	} catch (error) {
		console.warn(`Failed to read localStorage key: ${key}`, error);
		return fallback;
	}
}

export function saveValue(key, value)
{
	try {
		localStorage.setItem(key, value);
	} catch (error) {
		console.warn(`Failed to write localStorage key: ${key}`, error);
	}
}

export function removeValue(key)
{
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.warn(`Failed to remove localStorage key: ${key}`, error);
	}
}
