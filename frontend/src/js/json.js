function parseJsonText(text) {
    try {
        return JSON.parse(text);
    } catch (error) {
        throw new Error(`JSON inválido: ${error.message}`);
    }
}


function stringifyJson(data) {
    return JSON.stringify(data, null, 2);
}


function isJsonObject(value) {
    return (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value)
    );
}


function prepareJsonBody(text) {
    const data = parseJsonText(text);

    if (!isJsonObject(data)) {
        throw new Error('El cuerpo JSON debe ser un objeto.');
    }

    return JSON.stringify(data);
}