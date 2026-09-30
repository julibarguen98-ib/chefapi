let editingId = null;

let lastCurlCommand = '';


document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    initTabNavigation();

    try {
        await refreshData();
    } catch (error) {
        console.error(
            'No se pudieron cargar los datos iniciales:',
            error
        );
    }
});


async function refreshData(
    method = 'GET',
    endpoint = '/recipes/',
    status = '200 OK'
) {
    try {
        await loadCategories();
        const recipes = await loadRecipes();

        updateConsoleOutput(
            {
                status: 'success',
                count: recipes.length,
                recipes
            },
            method,
            endpoint,
            status
        );

        return recipes;

    } catch (error) {
        updateConsoleOutput(
            {
                error: error.message
            },
            method,
            endpoint,
            '500 Error'
        );

        throw error;
    }
}


function setupEventListeners() {
    const form =
        document.getElementById('form-recipe');

    const search =
        document.getElementById('search-input');

    const categoryFilter =
        document.getElementById('category-filter');

    const sortFilter =
        document.getElementById('sort-filter');


    if (search) {
        search.addEventListener(
            'input',
            applyFilters
        );
    }


    if (categoryFilter) {
        categoryFilter.addEventListener(
            'change',
            applyFilters
        );
    }


    if (sortFilter) {
        sortFilter.addEventListener(
            'change',
            applyFilters
        );
    }


    const btnAddRecipe =
        document.getElementById('btn-add-recipe');

    const btnAddCategory =
        document.getElementById('btn-add-category');

    const modalRecipe =
        document.getElementById('modal-recipe');

    const modalCategory =
        document.getElementById('modal-category');


    if (btnAddRecipe && modalRecipe) {
        btnAddRecipe.addEventListener(
            'click',
            () => {
                resetForm();

                modalRecipe.classList.remove(
                    'hidden'
                );

                modalRecipe.style.display = 'flex';
            }
        );
    }


    const closeRecipeButtons = [
        document.getElementById('close-recipe-modal'),
        document.getElementById('cancel-recipe-modal')
    ];


    closeRecipeButtons.forEach(button => {
        if (button) {
            button.addEventListener(
                'click',
                () => {
                    modalRecipe?.classList.add(
                        'hidden'
                    );

                    if (modalRecipe) {
                        modalRecipe.style.display =
                            'none';
                    }
                }
            );
        }
    });


    if (btnAddCategory && modalCategory) {
        btnAddCategory.addEventListener(
            'click',
            () => {
                modalCategory.classList.remove(
                    'hidden'
                );

                modalCategory.style.display = 'flex';
            }
        );
    }


    const closeCategoryButtons = [
        document.getElementById('close-category-modal'),
        document.getElementById('cancel-category-modal')
    ];


    closeCategoryButtons.forEach(button => {
        if (button) {
            button.addEventListener(
                'click',
                () => {
                    modalCategory?.classList.add(
                        'hidden'
                    );

                    if (modalCategory) {
                        modalCategory.style.display =
                            'none';
                    }
                }
            );
        }
    });


    if (form) {
        form.addEventListener(
            'submit',
            handleRecipeSubmit
        );
    }


    const formCategory =
        document.getElementById('form-category');


    if (formCategory) {
        formCategory.addEventListener(
            'submit',
            handleCategorySubmit
        );
    }


    const targetSelect =
        document.getElementById('target-select');


    if (targetSelect) {
        targetSelect.addEventListener(
            'change',
            async event => {
                setApiBaseUrl(
                    event.target.value
                );

                await refreshData(
                    'GET',
                    '/target-changed',
                    '200 OK'
                );
            }
        );
    }


    const tableBody =
        document.getElementById(
            'recipes-table-body'
        );


    if (tableBody) {
        tableBody.addEventListener(
            'click',
            async event => {
                const editButton =
                    event.target.closest(
                        '.btn-edit'
                    );

                const deleteButton =
                    event.target.closest(
                        '.btn-delete'
                    );


                if (editButton) {
                    const id =
                        Number(
                            editButton.dataset.id
                        );

                    await handleEditRecipe(id);
                }


                if (deleteButton) {
                    const id =
                        Number(
                            deleteButton.dataset.id
                        );

                    await handleDeleteRecipe(id);
                }
            }
        );
    }


    const copyCurlButton =
        document.getElementById('btn-copy-curl');


    if (copyCurlButton) {
        copyCurlButton.addEventListener(
            'click',
            async () => {
                await navigator.clipboard.writeText(
                    lastCurlCommand
                );

                alert(
                    'Comando cURL copiado al portapapeles'
                );
            }
        );
    }


    const clearButton =
        document.getElementById('clear-console');


    if (clearButton) {
        clearButton.addEventListener(
            'click',
            () => {
                const output =
                    document.getElementById(
                        'console-output'
                    );

                if (output) {
                    output.textContent =
                        '{\n  "status": "cleared"\n}';
                }
            }
        );
    }


    const sendDocButton =
        document.getElementById(
            'btn-send-doc-request'
        );


    if (sendDocButton) {
        sendDocButton.addEventListener(
            'click',
            sendDocRequest
        );
    }
}


async function handleRecipeSubmit(event) {
    event.preventDefault();

    const title =
        document.getElementById(
            'recipe-name'
        )?.value.trim() || '';

    const description =
        document.getElementById(
            'recipe-description'
        )?.value.trim() || null;

    const imageUrl =
        document.getElementById(
            'recipe-image'
        )?.value.trim() || null;

    const categoryId =
        Number(
            document.getElementById(
                'recipe-category'
            )?.value
        );

    const prepTime =
        Number(
            document.getElementById(
                'recipe-time'
            )?.value
        ) || 15;

    const price =
        Number(
            document.getElementById(
                'recipe-price'
            )?.value
        ) || 0;


    if (!title) {
        alert(
            'El título de la receta es obligatorio.'
        );
        return;
    }


    if (!categoryId) {
        alert(
            'Debes seleccionar una categoría.'
        );
        return;
    }


    const recipeData = {
        title,
        description,
        image_url: imageUrl,
        prep_time_minutes: prepTime,
        price,
        category_id: categoryId
    };


    try {
        let response;


        if (editingId === null) {
            response =
                await createRecipe(recipeData);

            updateConsoleOutput(
                response,
                'POST',
                '/recipes/',
                '201 Created'
            );

        } else {
            response =
                await updateRecipe(
                    editingId,
                    recipeData
                );

            updateConsoleOutput(
                response,
                'PUT',
                `/recipes/${editingId}`,
                '200 OK'
            );
        }


        closeRecipeModal();
        resetForm();

        await refreshData();

    } catch (error) {
        updateConsoleOutput(
            {
                error: error.message
            },
            editingId === null
                ? 'POST'
                : 'PUT',
            '/recipes/',
            'Error'
        );

        alert(
            `Error al guardar receta: ${error.message}`
        );
    }
}


async function handleCategorySubmit(event) {
    event.preventDefault();

    const name =
        document.getElementById(
            'category-name'
        )?.value.trim();


    if (!name) {
        return;
    }


    try {
        const response =
            await createCategory({
                name
            });

        updateConsoleOutput(
            response,
            'POST',
            '/categories/',
            '201 Created'
        );

        document
            .getElementById('form-category')
            ?.reset();

        closeCategoryModal();

        await refreshData();

    } catch (error) {
        alert(
            `Error al crear categoría: ${error.message}`
        );
    }
}


async function handleEditRecipe(id) {
    const recipe =
        await loadRecipe(id);


    if (!recipe) {
        return;
    }


    editingId = id;


    const inputId =
        document.getElementById('recipe-id');

    const inputName =
        document.getElementById('recipe-name');

    const inputDescription =
        document.getElementById(
            'recipe-description'
        );

    const selectCategory =
        document.getElementById(
            'recipe-category'
        );

    const inputTime =
        document.getElementById('recipe-time');

    const inputPrice =
        document.getElementById('recipe-price');


    if (inputId) {
        inputId.value = recipe.id;
    }


    if (inputName) {
        inputName.value =
            recipe.title || '';
    }


    if (inputDescription) {
        inputDescription.value =
            recipe.description || '';
    }


    if (selectCategory) {
        selectCategory.value =
            recipe.category_id || '';
    }


    if (inputTime) {
        inputTime.value =
            recipe.prep_time_minutes || '';
    }


    if (inputPrice) {
        inputPrice.value =
            recipe.price ?? '';
    }


    const modalTitle =
        document.getElementById(
            'modal-recipe-title'
        );


    if (modalTitle) {
        modalTitle.textContent =
            `PUT /api/v1/recipes/${id} — Editar Receta`;
    }


    const modal =
        document.getElementById(
            'modal-recipe'
        );


    if (modal) {
        modal.classList.remove(
            'hidden'
        );

        modal.style.display = 'flex';
    }
}


async function handleDeleteRecipe(id) {
    const confirmed =
        confirm(
            `¿Estás seguro de que deseas eliminar la receta #${id}?`
        );


    if (!confirmed) {
        return;
    }


    try {
        await deleteRecipe(id);

        updateConsoleOutput(
            {
                status: 'success',
                deleted_id: id
            },
            'DELETE',
            `/recipes/${id}`,
            '204 No Content'
        );

        await refreshData(
            'DELETE',
            `/recipes/${id}`,
            '204 No Content'
        );

    } catch (error) {
        alert(
            `Error al eliminar la receta: ${error.message}`
        );
    }
}


function applyFilters() {
    const search =
        document.getElementById(
            'search-input'
        );

    const categoryFilter =
        document.getElementById(
            'category-filter'
        );

    const sortFilter =
        document.getElementById(
            'sort-filter'
        );


    const text =
        search?.value.toLowerCase() || '';

    const category =
        categoryFilter?.value || 'ALL';

    const sort =
        sortFilter?.value || 'asc';


    let filtered =
        recipesState.filter(recipe => {
            const title =
                (
                    recipe.title || ''
                ).toLowerCase();

            const description =
                (
                    recipe.description || ''
                ).toLowerCase();

            const matchesText =
                title.includes(text) ||
                description.includes(text);


            const matchesCategory =
                category === 'ALL' ||
                String(recipe.category_id) ===
                    String(category);


            return (
                matchesText &&
                matchesCategory
            );
        });


    if (sort === 'asc') {
        filtered.sort(
            (a, b) => a.id - b.id
        );
    }


    if (sort === 'desc') {
        filtered.sort(
            (a, b) => b.id - a.id
        );
    }


    renderRecipesTable(filtered);
}


function updateConsoleOutput(
    data,
    method = 'GET',
    endpoint = '/recipes/',
    status = '200 OK',
    latencyMs = null
) {
    const methodElement =
        document.getElementById(
            'console-method'
        );

    const statusElement =
        document.getElementById(
            'console-status'
        );

    const latencyElement =
        document.getElementById(
            'console-latency'
        );

    const outputElement =
        document.getElementById(
            'console-output'
        );


    const latency =
        latencyMs !== null
            ? latencyMs
            : '0.0';


    if (methodElement) {
        methodElement.textContent =
            `${method} ${endpoint}`;

        methodElement.className =
            `method-badge ${method.toLowerCase()}`;
    }


    if (statusElement) {
        statusElement.textContent =
            status;

        statusElement.style.color =
            String(status).startsWith('2')
                ? '#10b981'
                : '#ef4444';
    }


    if (latencyElement) {
        latencyElement.textContent =
            `${latency} ms`;
    }


    if (outputElement) {
        outputElement.textContent =
            JSON.stringify(
                data,
                null,
                2
            );
    }


    const baseUrl =
        getApiBaseUrl();

    lastCurlCommand =
        `curl -X '${method}' ` +
        `'${baseUrl}${endpoint}' ` +
        `-H 'accept: application/json'`;
}


function resetForm() {
    const form =
        document.getElementById(
            'form-recipe'
        );

    if (form) {
        form.reset();
    }


    editingId = null;


    const recipeId =
        document.getElementById(
            'recipe-id'
        );

    if (recipeId) {
        recipeId.value = '';
    }


    const modalTitle =
        document.getElementById(
            'modal-recipe-title'
        );

    if (modalTitle) {
        modalTitle.textContent =
            'POST /api/v1/recipes — Crear Receta';
    }
}


function closeRecipeModal() {
    const modal =
        document.getElementById(
            'modal-recipe'
        );

    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}


function closeCategoryModal() {
    const modal =
        document.getElementById(
            'modal-category'
        );

    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}


function initTabNavigation() {
    const tabButtons =
        document.querySelectorAll(
            '.nav-tab'
        );

    const tabContents =
        document.querySelectorAll(
            '.tab-content'
        );


    tabButtons.forEach(button => {
        button.addEventListener(
            'click',
            () => {
                const targetId =
                    button.getAttribute(
                        'data-tab'
                    );


                tabButtons.forEach(
                    item =>
                        item.classList.remove(
                            'active'
                        )
                );


                tabContents.forEach(
                    content =>
                        content.classList.remove(
                            'active'
                        )
                );


                button.classList.add(
                    'active'
                );


                const target =
                    document.getElementById(
                        targetId
                    );


                if (target) {
                    target.classList.add(
                        'active'
                    );
                }
            }
        );
    });
}