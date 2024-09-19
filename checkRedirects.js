const axios = require('axios');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const unidecode = require('unidecode');
const { URL } = require('url');

// Função para carregar o arquivo Excel
function loadExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Considera que o Excel tem apenas uma aba
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
}

// Função para normalizar a URL
function normalizeUrl(url) {
    try {
        const urlObj = new URL(url, 'http://localhost'); // 'http://localhost' é apenas um base para parsing
        return urlObj.pathname; // Retorna apenas o caminho da URL
    } catch (e) {
        return url; // Caso a URL não seja válida, retorna a URL original
    }
}

// Função para verificar o redirecionamento de uma URL
async function checkRedirect(fromUrl, expectedToUrl) {
    try {
        const response = await axios.get(fromUrl, {
            maxRedirects: 0, // Não seguir redirecionamentos
            validateStatus: status => status >= 300 && status < 400 // Apenas status 3xx são válidos
        });
        const actualToUrl = response.headers.location;

        if (normalizeUrl(actualToUrl) === normalizeUrl(expectedToUrl)) {
            return { fromUrl, status: 'Success', actualToUrl };
        } else {
            return { fromUrl, status: 'Failure', actualToUrl };
        }
    } catch (error) {
        return { fromUrl, status: 'Error', actualToUrl: error.message };
    }
}

// Função principal para ler o arquivo Excel e verificar as URLs
async function main() {
    const filePath = './[SCHUTZ] URL Status 404 - Redirects De x Para.xlsx'; // Caminho do arquivo Excel
    const redirects = loadExcel(filePath);

    const results = [];

    for (const redirect of redirects) {
        // Normalizar URLs para evitar problemas com acentuações
        const fromUrl = unidecode(redirect['De']);
        const toUrl = unidecode(redirect['Para']);

        if (fromUrl && toUrl) {
            const result = await checkRedirect(fromUrl, toUrl);
            results.push(result);
        } else {
            results.push({ fromUrl, status: 'Error', actualToUrl: 'Falta URL de origem ou destino' });
        }
    }

    // Gerar relatório
    generateReport(results);
}

// Função para gerar o relatório em HTML
function generateReport(results) {
    const reportPath = path.join(__dirname, 'redirect_report.html');
    const summary = {
        success: results.filter(r => r.status === 'Success').length,
        failure: results.filter(r => r.status === 'Failure').length,
        error: results.filter(r => r.status === 'Error').length
    };

    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redirect Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .container { width: 90%; margin: 20px auto; }
            h1 { text-align: center; }
            .summary { margin: 20px 0; font-size: 18px; }
            .summary div { margin-bottom: 10px; }
            .filter-buttons { text-align: center; margin: 20px 0; }
            .filter-buttons button { margin: 0 5px; padding: 10px 15px; cursor: pointer; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f4f4f4; }
            tr.success { background-color: #eaffea; }
            tr.failure { background-color: #ffeaea; }
            tr.error { background-color: #ffebc3; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Redirect Report</h1>
            <div class="summary">
                <div><strong>Total:</strong> ${results.length}</div>
                <div><strong>Success:</strong> ${summary.success}</div>
                <div><strong>Failure:</strong> ${summary.failure}</div>
                <div><strong>Error:</strong> ${summary.error}</div>
            </div>
            <div class="filter-buttons">
                <button onclick="filterTable('all')">Mostrar Todos</button>
                <button onclick="filterTable('success')">Mostrar Sucesso</button>
                <button onclick="filterTable('failure')">Mostrar Falha</button>
                <button onclick="filterTable('error')">Mostrar Erro</button>
            </div>
            <table id="results-table">
                <thead>
                    <tr>
                        <th>URL de Origem</th>
                        <th>Status</th>
                        <th>URL de Destino</th>
                    </tr>
                </thead>
                <tbody>
    `;

    results.forEach(result => {
        const rowClass = result.status.toLowerCase();
        htmlContent += `
            <tr class="${rowClass}">
                <td><a href="${result.fromUrl}" target="_blank">${result.fromUrl}</a></td>
                <td><a href="#" onclick="showDetails('${rowClass}')">${result.status}</a></td>
                <td>${result.status === 'Success' ? `<a href="${result.actualToUrl}" target="_blank">${result.actualToUrl}</a>` : result.actualToUrl}</td>
            </tr>
        `;
    });

    htmlContent += `
                </tbody>
            </table>
        </div>
        <script>
            function filterTable(status) {
                const rows = document.querySelectorAll('#results-table tbody tr');
                rows.forEach(row => {
                    if (status === 'all') {
                        row.style.display = '';
                    } else {
                        row.style.display = row.classList.contains(status) ? '' : 'none';
                    }
                });
            }

            function showDetails(status) {
                const rows = document.querySelectorAll('#results-table tbody tr');
                rows.forEach(row => {
                    if (row.classList.contains(status)) {
                        row.style.backgroundColor = '#ffff99'; // Cor de destaque
                    } else {
                        row.style.backgroundColor = '';
                    }
                });
            }
        </script>
    </body>
    </html>
    `;

    fs.writeFileSync(reportPath, htmlContent);
    console.log(`Relatório gerado em ${reportPath}`);
}

// Executar o script
main();
