let categoriesState = [];


async function loadCategories() {
    try {
        categoriesState = await getCategories();

        populateCategoriesDropdowns(categoriesState);

        return categoriesState;

    } catch (error) {
        console.error('Error al cargar categorías:', error);
        throw error;
    }
}


async function loadCategory(id) {
    try {
        const category = await getCategory(id);

        return category;

    } catch (error) {
        console.error(`Error al cargar categoría ${id}:`, error);
        throw error;
    }
}


function populateCategoriesDropdowns(categories) {
    const filterSelect = document.getElementById('category-filter');
    const formSelect = document.getElementById('recipe-category');

    if (filterSelect) {
        filterSelect.innerHTML =
            '<option value="ALL">Todas las Categorías</option>';

        categories.forEach(category => {
            filterSelect.innerHTML += `
                <option value="${category.id}">
                    ${category.name}
                </option>
            `;
        });
    }

    if (formSelect) {
        formSelect.innerHTML =
            '<option value="">-- Seleccionar Categoría --</option>';

        categories.forEach(category => {
            formSelect.innerHTML += `
                <option value="${category.id}">
                    ${category.name}
                </option>
            `;
        });
    }
}