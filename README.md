Aqui está o texto completo formatado corretamente em Markdown para o seu `README.md`:

```markdown
# Redirect Checker

Este projeto é uma ferramenta para verificar redirecionamentos de URLs com base em um arquivo Excel. Ele lê um arquivo de mapeamento de redirecionamentos e valida se as URLs estão corretamente redirecionando para os destinos esperados.

## Funcionalidades

- Leitura de arquivos Excel contendo mapeamentos de redirecionamentos (colunas "De" e "Para").
- Verificação de redirecionamentos usando o Axios, sem seguir automaticamente os redirecionamentos.
- Geração de um relatório HTML detalhado contendo:
  - Status da verificação (Sucesso, Falha, Erro).
  - URLs clicáveis para fácil navegação.
  - Filtros interativos no relatório para ver apenas sucessos, falhas ou erros.
  - Decodificação de URLs para evitar problemas com caracteres como `%20` e acentuações.
  
## Requisitos

- Node.js (versão 14 ou superior)
- Pacotes NPM necessários:
  - `axios`
  - `xlsx`
  - `unidecode`

## Instalação

1. Clone o repositório:

   ```bash
   git clone: PRIVADO
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd redirect-checker
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

## Uso

1. Coloque o arquivo Excel contendo as URLs de origem e destino no mesmo diretório do script. O arquivo deve ter as seguintes colunas:
   - **De**: URL de origem
   - **Para**: URL de destino

2. Modifique o caminho do arquivo Excel no código, caso necessário:

   ```javascript
   const filePath = './Arquivo de sua escolha'; // Caminho do arquivo Excel
   ```

3. Execute o script:

   ```bash
   node checkRedirects.js
   ```

4. Após a execução, o relatório será gerado como `redirect_report.html` no diretório do projeto.

## Relatório

O relatório gerado será um arquivo HTML que pode ser aberto em qualquer navegador. Ele inclui:

- **URLs de origem e destino**: As URLs verificadas são exibidas como links clicáveis.
- **Status**: Cada URL é marcada como Sucesso, Falha ou Erro.
- **Filtros**: Você pode usar os botões de filtro no relatório para ver apenas sucessos, falhas ou erros.

## Exemplo de Relatório

![Exemplo de Relatório](![image](https://github.com/user-attachments/assets/74a30dee-0cef-47dc-8f44-a298b76076e0)

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas ou enviar pull requests.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
```

Você pode copiar e colar esse texto diretamente no arquivo `README.md` para incluir todas as informações sobre o projeto.


Projeto Criado com o Uso de Inteligencia Artificial - OPEN IA - Chat GPT
