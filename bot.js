const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client();

// Estrutura de dados que armazena os dados de cada usuário (identificado pelo número de telefone)
let dadosUsuarios = {};

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('✅ Bot de finanças pronto!'));

client.on('message', message => {
    const texto = message.body.toLowerCase();
    const numeroTelefone = message.from; // Número de telefone que enviou a mensagem
    const mesAtual = new Date().toISOString().slice(0, 7); // Ex: "2025-05"

    // Inicializa os dados do usuário se ainda não existirem
    if (!dadosUsuarios[numeroTelefone]) {
        dadosUsuarios[numeroTelefone] = {};
    }

    if (!dadosUsuarios[numeroTelefone][mesAtual]) {
        dadosUsuarios[numeroTelefone][mesAtual] = { ganhos: [], gastos: [] };
    }

    // REGISTRAR GANHO
    if (texto.startsWith('ganhei')) {
        const { valor, descricao, categoria } = interpretarEntrada(texto);
        dadosUsuarios[numeroTelefone][mesAtual].ganhos.push({ valor, descricao, categoria });
        salvarEResponder(message, numeroTelefone, '💰 Ganho registrado!');
    }

    // REGISTRAR GASTO
    else if (texto.startsWith('gastei')) {
        const { valor, descricao, categoria } = interpretarEntrada(texto);
        dadosUsuarios[numeroTelefone][mesAtual].gastos.push({ valor, descricao, categoria });
        salvarEResponder(message, numeroTelefone, '💸 Gasto registrado!');
    }

    // RESUMO
    else if (texto === 'resumo') {
        enviarResumo(message, numeroTelefone, mesAtual);
    }

    // AJUDA
    else if (texto === 'ajuda') {
        enviarAjuda(message);
    }
});

function interpretarEntrada(texto) {
    const regex = /^(ganhei|gastei)\s+([\d.]+)\s+(.+?)\s+(.+)$/i;
    const match = texto.match(regex);

    if (match) {
        const valor = parseFloat(match[2]);
        const descricao = match[3]?.trim() || 'sem descrição';
        const categoria = match[4]?.trim() || 'geral';
        return { valor, descricao, categoria };
    } else {
        return null;
    }
}

function salvarEResponder(message, numeroTelefone, confirmacao) {
    fs.writeFileSync('dados_usuarios.json', JSON.stringify(dadosUsuarios, null, 2));
    message.reply(confirmacao);
    enviarResumo(message, numeroTelefone, new Date().toISOString().slice(0, 7));
}

function enviarResumo(message, numeroTelefone, mes) {
    const mesDados = dadosUsuarios[numeroTelefone][mes];

    const totalGanhos = mesDados.ganhos.reduce((soma, g) => soma + g.valor, 0);
    const totalGastos = mesDados.gastos.reduce((soma, g) => soma + g.valor, 0);
    const saldo = totalGanhos - totalGastos;

    // Resumo por categoria
    const resumoPorCategoria = (dados) => {
        const categorias = {};
        dados.forEach(item => {
            categorias[item.categoria] = categorias[item.categoria] || 0;
            categorias[item.categoria] += item.valor;
        });

        return Object.entries(categorias)
            .map(([categoria, valor]) => ` ${categoria}: R$ ${valor.toFixed(2)}`)
            .join('\n') || 'Nenhuma.';
    };

    const formatar = lista => lista.map(item =>
        `- R$ ${item.valor.toFixed(2)} - ${item.descricao} [${item.categoria}]`).join('\n') || 'Nenhum.';

    const resumo = `📊 *Resumo Financeiro (${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })})*\n\n` +
        `💰 *Ganhos:*\n${formatar(mesDados.ganhos)}\n\n` +
        `💸 *Gastos:*\n${formatar(mesDados.gastos)}\n\n` +
        `📈 *Totais:*\n+ R$ ${totalGanhos.toFixed(2)}\n- R$ ${totalGastos.toFixed(2)}\n= R$ ${saldo.toFixed(2)}\n\n` +
        `📊 *Por categoria:*\n${resumoPorCategoria(mesDados.gastos)}`;

    message.reply(resumo);
}

function enviarAjuda(message) {
    const ajuda = `📘 *Comandos disponíveis:*\n\n` +
        `💰 *Ganhei [valor] [descrição] [categoria]* - Registra um ganho.\n` +
        `💸 *Gastei [valor] [descrição] [categoria]* - Registra um gasto.\n` +
        `📊 *Resumo* - Exibe o resumo do mês atual.\n` +
        `📅 *Resumo [mês]* - Exibe o resumo de um mês específico (exemplo: resumo 2025-05).\n` +
        `❓ *Ajuda* - Exibe a lista de comandos disponíveis.`;

    message.reply(ajuda);
}

client.initialize();
