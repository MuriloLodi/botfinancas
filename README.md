
# Bot de Finanças

Este é um bot de WhatsApp desenvolvido com Node.js para ajudar no controle de finanças pessoais. O bot permite registrar ganhos e gastos, gerar um resumo financeiro mensal, e realizar exportações dos dados financeiros.

## Funcionalidades

- **Registrar ganhos**: Envie uma mensagem com o valor e descrição do ganho.
- **Registrar gastos**: Envie uma mensagem com o valor e descrição do gasto.
- **Resumo financeiro**: O bot pode fornecer um resumo completo dos ganhos e gastos do mês atual.
- **Exportação de dados**: O bot pode gerar um relatório financeiro em formato PDF ou Excel.

## Como Funciona

1. **Ganhos**: Para registrar um ganho, envie a seguinte mensagem:

   ```
   Ganhei [valor] [descrição] [categoria]
   ```

   Exemplo: `Ganhei 1000 Mercado pagamento Salário`.

2. **Gastos**: Para registrar um gasto, envie a seguinte mensagem:

   ```
   Gastei [valor] [descrição] [categoria]
   ```

   Exemplo: `Gastei 70 Compra lazer`.

3. **Resumo Financeiro**: Envie a mensagem `Resumo` para receber um resumo do mês atual.

4. **Exportar PDF**: Envie `Exportar PDF` para gerar um relatório financeiro em PDF.

5. **Exportar Excel**: Envie `Exportar Excel` para gerar um relatório financeiro em formato Excel.

## Pré-requisitos

Certifique-se de ter os seguintes programas e bibliotecas instalados:

- **Node.js** (versão 12 ou superior)
- **NPM** (gerenciador de pacotes do Node.js)
- **WhatsApp Web.js** (Biblioteca para interação com o WhatsApp)
- **MongoDB** (para armazenar os dados de forma persistente)
- **PDFKit** (para gerar arquivos PDF)
- **ExcelJS** (para gerar arquivos Excel)

## Como Rodar

1. Clone o repositório:

   ```bash
   git clone https://github.com/MuriloLodi/botfinancas.git
   ```

2. Navegue para o diretório do projeto:

   ```bash
   cd botfinancas
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Crie um arquivo `config.js` para armazenar as configurações do bot (exemplo abaixo):

   ```javascript
   module.exports = {
     whatsappSessionName: 'financas-bot', // Nome da sessão do WhatsApp
     mongoURI: 'sua_conexao_do_MongoDB',  // Conexão com o banco MongoDB
   };
   ```

5. Inicie o bot:

   ```bash
   node bot.js
   ```

6. O bot gerará um QR code no terminal, escaneie-o no WhatsApp Web para conectar o bot à sua conta.

## Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).

## Contribuições

Contribuições são bem-vindas! Se você tiver sugestões ou correções, por favor, envie um pull request.
