let API_BASE_URL = 'http://127.0.0.1:8000/api/v1';


function setApiBaseUrl(newUrl) {
    API_BASE_URL = newUrl.replace(/\/$/, '');
}


function getApiBaseUrl() {
    return API_BASE_URL;
}


async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        Accept: 'application/json',
        ...options.headers
    };

    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 204) {
            return { success: true };
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const detailMsg = Array.isArray(data.detail)
                ? data.detail
                    .map(error => {
                        const location = error.loc
                            ? error.loc.join('.')
                            : 'request';

                        return `${location}: ${error.msg}`;
                    })
                    .join(' | ')
                : data.detail || `Error HTTP ${response.status}`;

            throw new Error(detailMsg);
        }

        return data;

    } catch (error) {
        console.error(`Error en API (${url}):`, error);
        throw error;
    }
}


/*CATEGORÍAS*/

async function getCategories() {
    return request('/categories/');
}


async function getCategory(id) {
    if (!id) {
        throw new Error('El ID de la categoría es obligatorio.');
    }

    return request(`/categories/${id}`);
}


async function createCategory(data) {
    return request('/categories/', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}


async function updateCategory(id, data) {
    return request(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}


async function deleteCategory(id) {
    return request(`/categories/${id}`, {
        method: 'DELETE'
    });
}


/*RECETAS*/

async function getRecipes() {
    return request('/recipes/');
}


async function getRecipe(id) {
    if (!id) {
        throw new Error('El ID de la receta es obligatorio.');
    }

    return request(`/recipes/${id}`);
}


async function createRecipe(data) {
    return request('/recipes/', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}


async function updateRecipe(id, data) {
    return request(`/recipes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}


async function deleteRecipe(id) {
    return request(`/recipes/${id}`, {
        method: 'DELETE'
    });
}