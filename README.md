# 🤖 Bot de Finanças no WhatsApp

Um bot inteligente para controle financeiro pessoal via WhatsApp, desenvolvido com `whatsapp-web.js` e `Node.js`.

## ✨ Funcionalidades

- Registro de **ganhos**, **gastos** e **investimentos**
- Resumo diário automático às 20h
- Consulta de **saldo mensal**
- Busca de gastos por descrição
- Consulta de **resumo por mês**
- Interface 100% via mensagens no WhatsApp

## 📦 Tecnologias

- [Node.js](https://nodejs.org)
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [node-cron](https://www.npmjs.com/package/node-cron)
- [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal)
- [fs (file system)](https://nodejs.org/api/fs.html)

## ⚙️ Instalação

```bash
# Clone o repositório
git clone https://github.com/MuriloLodi/botfinancas.git
cd botfinancas

# Instale as dependências
npm install
```

> ⚠️ **Importante**: certifique-se de que o Chrome ou Chromium esteja instalado em seu sistema, pois o `whatsapp-web.js` usa o Puppeteer internamente.

## 🚀 Como executar

```bash
node index.js
```

Escaneie o QR Code com seu WhatsApp e pronto! O bot estará online.

## 💬 Comandos disponíveis

```
💰 Ganhei [valor] [descrição]
💸 Gastei [valor] [descrição]
📈 Investi [valor] [descrição]
📊 Resumo — Mostra os dados do mês atual
📅 Resumo [ano-mês] — Exemplo: resumo 2025-05
💼 Saldo — Mostra o saldo do mês atual
🔎 Buscar [termo] — Ex: buscar mercado
❓ Ajuda — Mostra todos os comandos disponíveis
```

## 💡 Exemplo de uso

```
ganhei 1000 salário
gastei 200 mercado
investi 300 tesouro direto
resumo
saldo
buscar mercado
```

## 🗂 Armazenamento

Os dados são armazenados em um arquivo local: `dados_usuarios.json`.

> Em breve: suporte a banco de dados com MongoDB.

## 🧠 Contribuição

Sinta-se à vontade para sugerir melhorias ou abrir PRs. Toda ajuda é bem-vinda!

## 📄 Licença

[MIT](./LICENSE)

---

Feito com 💙 por [Murilo Henrique Lodi](https://github.com/MuriloLodi)