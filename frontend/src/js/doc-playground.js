async function testEndpoint(method, endpoint) {
    const methodElement =
        document.getElementById('doc-req-method');

    const urlElement =
        document.getElementById('doc-req-url');

    if (!methodElement || !urlElement) {
        return;
    }

    methodElement.textContent = method;
    methodElement.className =
        `badge badge-${method.toLowerCase()}`;

    urlElement.textContent = endpoint;

    const payloadElement =
        document.getElementById('doc-req-payload');

    if (payloadElement && method === 'GET') {
        payloadElement.textContent = '';
    }
}


function switchToPlayground() {
    const playgroundButton =
        document.querySelector(
            '[data-tab="tab-playground"]'
        );

    if (playgroundButton) {
        playgroundButton.click();
    }
}


async function sendDocRequest() {
    const method =
        document.getElementById('doc-req-method')?.textContent;

    const endpoint =
        document.getElementById('doc-req-url')?.textContent;

    const payloadText =
        document.getElementById('doc-req-payload')?.innerText || '';

    const targetSelect =
        document.getElementById('target-select');

    const baseUrl =
        targetSelect?.value || getApiBaseUrl();

    if (!method || !endpoint) {
        return;
    }

    try {
        const options = {
            method,
            headers: {
                Accept: 'application/json'
            }
        };

        if (method !== 'GET' && method !== 'DELETE') {
            options.headers['Content-Type'] =
                'application/json';

            options.body = prepareJsonBody(payloadText);
        }

        const cleanEndpoint =
            endpoint.replace(/^\/api\/v1/, '');

        const response = await fetch(
            `${baseUrl}${cleanEndpoint}`,
            options
        );

        const data =
            response.status === 204
                ? { success: true }
                : await response.json().catch(() => ({}));

        const statusElement =
            document.getElementById('doc-res-status');

        const bodyElement =
            document.getElementById('doc-res-body');

        if (statusElement) {
            statusElement.textContent =
                `${response.status} ${response.statusText}`;
        }

        if (bodyElement) {
            bodyElement.textContent =
                stringifyJson(data);
        }

    } catch (error) {
        const statusElement =
            document.getElementById('doc-res-status');

        const bodyElement =
            document.getElementById('doc-res-body');

        if (statusElement) {
            statusElement.textContent =
                'Error de conexión';
        }

        if (bodyElement) {
            bodyElement.textContent =
                stringifyJson({
                    error: error.message
                });
        }
    }
}