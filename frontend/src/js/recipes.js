let recipesState = [];


async function loadRecipes() {
    try {
        recipesState = await getRecipes();

        renderRecipesTable(recipesState);
        updateMetrics(recipesState, categoriesState);

        return recipesState;

    } catch (error) {
        console.error('Error al cargar recetas:', error);
        throw error;
    }
}


async function loadRecipe(id) {
    try {
        return await getRecipe(id);
    } catch (error) {
        console.error(`Error al cargar receta ${id}:`, error);
        throw error;
    }
}


function renderRecipesTable(recipes) {
    const tableBody =
        document.getElementById('recipes-table-body');

    const recordsFound =
        document.getElementById('records-found');

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = '';

    if (recordsFound) {
        recordsFound.textContent =
            `${recipes.length} registros coincidentes`;
    }

    if (!recipes || recipes.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:20px;">
                    No se encontraron recetas.
                </td>
            </tr>
        `;

        return;
    }

    recipes.forEach(recipe => {
        const row = document.createElement('tr');

        const categoryName =
            recipe.category?.name || 'Sin categoría';
        
        const imageUrl = 
            recipe.image_url ||
            'https://via.placeholder.com/50?text=Sin+Imagen';

        row.innerHTML = `
            <td>#${recipe.id}</td>

            <td>
            <img
                src="${escapeHtml(imageUrl)}"
                alt="${escapeHtml(recipe.title)}"
                class="img-preview"
                onerror="this.src='https://via.placeholder.com/50?text=Error'">
            </td>

            <td>
                <strong>${escapeHtml(recipe.title)}</strong>
                <br>
                <small>
                    ${escapeHtml(recipe.description || '')}
                </small>
            </td>

            <td>
                <span class="badge-category">
                    ${escapeHtml(categoryName)}
                </span>
            </td>

            <td>
                ${recipe.prep_time_minutes ?? 0} min
            </td>

            <td>
                €${Number(recipe.price || 0).toFixed(2)}
            </td>

            <td>
                <button
                    class="btn btn-secondary btn-edit"
                    data-id="${recipe.id}">
                    Editar
                </button>

                <button
                    class="btn btn-danger btn-delete"
                    data-id="${recipe.id}">
                    Eliminar
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


function updateMetrics(recipes, categories) {
    const countElem =
        document.getElementById('metric-recipes-count');

    const catElem =
        document.getElementById('metric-categories-count');

    const avgElem =
        document.getElementById('metric-avg-time');

    if (countElem) {
        countElem.textContent = recipes.length;
    }

    if (catElem) {
        catElem.textContent = categories.length;
    }

    if (avgElem) {
        const totalTime = recipes.reduce(
            (total, recipe) =>
                total + (Number(recipe.prep_time_minutes) || 0),
            0
        );

        const average =
            recipes.length > 0
                ? Math.round(totalTime / recipes.length)
                : 0;

        avgElem.textContent = `${average} min`;
    }
}


function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}