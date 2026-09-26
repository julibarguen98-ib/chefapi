function renderRecipesTable(recipes) {
    const tableBody = document.getElementById('recipes-table-body');
    const recordsFound = document.getElementById('records-found');
    
    tableBody.innerHTML = '';
    recordsFound.textContent = `${recipes.length} registros coincidentes`;

    if (recipes.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px; color: #64748b;">
                    No se encontraron recetas.
                </td>
            </tr>`;
        return;
    }

    recipes.forEach(recipe => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${recipe.id}</td>
            <td><strong>${recipe.name}</strong><br><small style="color: #64748b;">${recipe.technique || 'N/A'}</small></td>
            <td><span class="badge-category">${recipe.category || 'General'}</span></td>
            <td>${recipe.cook_time ? recipe.cook_time + ' min' : 'N/A'}</td>
            <td>$${recipe.price ? recipe.price.toFixed(2) : '0.00'}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateMetrics(recipes, categories) {
    document.getElementById('metric-recipes-count').textContent = recipes.length;
    document.getElementById('metric-categories-count').textContent = categories.length;

    const totalTime = recipes.reduce((acc, curr) => acc + (curr.cook_time || 0), 0);
    const avgTime = recipes.length > 0 ? Math.round(totalTime / recipes.length) : 0;
    document.getElementById('metric-avg-time').textContent = `${avgTime} min`;
}

function populateCategoriesSelect(categories) {
    const select = document.getElementById('category-filter');
    select.innerHTML = '<option value="ALL">Todas las Categorías</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id || category.name;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function updateConsoleOutput(data) {
    const consoleOutput = document.getElementById('console-output');
    consoleOutput.textContent = JSON.stringify(data, null, 2);
}
