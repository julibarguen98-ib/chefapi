let state = {
    recipes: [],
    categories: []
};

document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    try {
        const [recipesData, categoriesData] = await Promise.all([
            fetchRecipes(),
            fetchCategories()
        ]);

        state.recipes = recipesData;
        state.categories = categoriesData;

        renderRecipesTable(state.recipes);
        updateMetrics(state.recipes, state.categories);
        populateCategoriesSelect(state.categories);
        updateConsoleOutput({ status: 'success', total_recipes: state.recipes.length, data: state.recipes });
    } catch (error) {
        updateConsoleOutput({ status: 'error', message: error.message });
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const clearConsoleBtn = document.getElementById('clear-console');

    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);

    if (clearConsoleBtn) {
        clearConsoleBtn.addEventListener('click', () => {
            updateConsoleOutput({ status: 'idle', message: 'Consola limpia' });
        });
    }
}

function applyFilters() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const selectedCategory = document.getElementById('category-filter').value;
    const sortOrder = document.getElementById('sort-filter').value;

    let filtered = state.recipes.filter(recipe => {
        const matchesQuery = recipe.name.toLowerCase().includes(query) ||
                             (recipe.technique && recipe.technique.toLowerCase().includes(query));
        const matchesCategory = selectedCategory === 'ALL' || recipe.category === selectedCategory;
        return matchesQuery && matchesCategory;
    });

    if (sortOrder === 'asc') {
        filtered.sort((a, b) => a.id - b.id);
    } else if (sortOrder === 'desc') {
        filtered.sort((a, b) => b.id - a.id);
    }

    renderRecipesTable(filtered);
}
