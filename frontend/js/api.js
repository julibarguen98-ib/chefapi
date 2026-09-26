const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

async function fetchRecipes() {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}
