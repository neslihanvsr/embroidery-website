/**
 * utils.js
 *
 * Contains shared utility functions used across different JavaScript modules.
 */

/**
 * Fetches JSON data from a given path.
 * @param {string} path - The path to the JSON file.
 * @returns {Promise<Array>} A promise that resolves with the JSON data.
 */
export async function fetchData(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${path}:`, error);
        return [];
    }
}