const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const cron = require('node-cron');

const client = new Client();
let dadosUsuarios = {};

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => {
    console.log('✅ Bot de finanças pronto!');
    
    // Agendar a mensagem automática às 20h
    cron.schedule('0 20 * * *', () => {
        const agora = new Date();
        const mesAtual = agora.toISOString().slice(0, 7);
        
        // Enviar mensagem automática para todos os usuários
        for (let numero in dadosUsuarios) {
            const usuario = dadosUsuarios[numero];
            if (usuario[mesAtual]) {
                const ganhos = usuario[mesAtual].ganhos.reduce((s, g) => s + g.valor, 0);
                const gastos = usuario[mesAtual].gastos.reduce((s, g) => s + g.valor, 0);
                const saldo = ganhos - gastos;

                const resumo = `📊 *Resumo Financeiro do Dia*\n\n` +
                    `💰 *Ganhos:* R$ ${ganhos.toFixed(2)}\n` +
                    `💸 *Gastos:* R$ ${gastos.toFixed(2)}\n` +
                    `📉 *Saldo:* R$ ${saldo.toFixed(2)}\n` +
                    `*Não se esqueça de registrar seus novos ganhos ou gastos!`;

                client.sendMessage(numero, resumo);
            }
        }
    });
});

client.on('message', async message => {
    const texto = message.body.toLowerCase();
    const numero = message.from;
    const mesAtual = new Date().toISOString().slice(0, 7);

    if (!dadosUsuarios[numero]) dadosUsuarios[numero] = {};
    if (!dadosUsuarios[numero][mesAtual]) dadosUsuarios[numero][mesAtual] = { ganhos: [], gastos: [], investimentos: [] };

    // GANHO
    if (texto.startsWith('ganhei')) {
        const { valor, descricao } = interpretarEntrada(texto);
        dadosUsuarios[numero][mesAtual].ganhos.push({ valor, descricao, data: dataHoje() });
        salvarEResponder(message, numero, '💰 Ganho registrado!');
    }

    // GASTO
    else if (texto.startsWith('gastei')) {
        const { valor, descricao } = interpretarEntrada(texto);
        dadosUsuarios[numero][mesAtual].gastos.push({ valor, descricao, data: dataHoje() });
        salvarEResponder(message, numero, '💸 Gasto registrado!');
    }

    // INVESTIMENTO
    else if (texto.startsWith('investi')) {
        const { valor, descricao } = interpretarEntrada(texto);
        dadosUsuarios[numero][mesAtual].investimentos.push({ valor, descricao });
        salvarEResponder(message, numero, '📈 Investimento registrado!');
    }

    // RESUMO
    else if (texto.startsWith('resumo')) {
        const partes = texto.split(' ');
        const mes = partes[1] || mesAtual;
        if (!dadosUsuarios[numero][mes]) return message.reply('⚠️ Nenhum registro encontrado nesse mês.');
        enviarResumo(message, numero, mes);
    }

    // SALDO
    else if (texto === 'saldo') {
        const mesDados = dadosUsuarios[numero][mesAtual];
        const ganhos = mesDados.ganhos.reduce((s, g) => s + g.valor, 0);
        const gastos = mesDados.gastos.reduce((s, g) => s + g.valor, 0);
        const saldo = ganhos - gastos;
        message.reply(`💼 Saldo do mês: R$ ${saldo.toFixed(2)}`);
    }

    // BUSCAR
    else if (texto.startsWith('buscar')) {
        const termo = texto.replace('buscar', '').trim();
        const mesDados = dadosUsuarios[numero][mesAtual];
        const encontrados = mesDados.gastos
            .filter(g => g.descricao.includes(termo))
            .map(g => `- R$ ${g.valor.toFixed(2)} - ${g.descricao}`)
            .join('\n') || 'Nada encontrado.';
        message.reply(`🔎 Resultados para "${termo}":\n${encontrados}`);
    }

    // AJUDA
    else if (texto === 'ajuda') {
        const ajuda = `📘 *Comandos disponíveis:*\n\n` +
            `💰 *Ganhei [valor] [descrição]*\n` +
            `💸 *Gastei [valor] [descrição]*\n` +
            `📈 *Investi [valor] [descrição]*\n` +
            `📊 *Resumo* - Mostra os dados do mês atual\n` +
            `📅 *Resumo [ano-mês]* - Ex: resumo 2025-05\n` +
            `💼 *Saldo* - Mostra o saldo do mês\n` +
            `🔎 *Buscar [termo]* - Ex: buscar mercado\n` +
            `❓ *Ajuda* - Exibe esta mensagem`;
        message.reply(ajuda);
    }
});

function interpretarEntrada(texto) {
    const partes = texto.split(' ');
    const valor = parseFloat(partes[1]) || 0;
    const descricao = partes.slice(2).join(' ') || 'sem descrição';
    return { valor, descricao };
}

function salvarEResponder(message, numero, confirmacao) {
    fs.writeFileSync('dados_usuarios.json', JSON.stringify(dadosUsuarios, null, 2));
    message.reply(confirmacao);
    enviarResumo(message, numero, new Date().toISOString().slice(0, 7));
}

function enviarResumo(message, numero, mes) {
    const dados = dadosUsuarios[numero][mes];
    const ganhos = dados.ganhos.reduce((s, g) => s + g.valor, 0);
    const gastos = dados.gastos.reduce((s, g) => s + g.valor, 0);
    const investimentos = dados.investimentos.reduce((s, i) => s + parseFloat(i.valor), 0);
    const saldo = ganhos - gastos;

    const formatar = lista => lista.map(i =>
        `- R$ ${i.valor.toFixed(2)} - ${i.descricao}`).join('\n') || 'Nenhum.';

    const resumo = `📊 *Resumo Financeiro (${mes})*\n\n` +
        `💰 *Ganhos:*\n${formatar(dados.ganhos)}\n\n` +
        `💸 *Gastos:*\n${formatar(dados.gastos)}\n\n` +
        `📈 *Investimentos:*\n${formatar(dados.investimentos)}\n\n` +
        `📈 *Totais:*\n+ R$ ${ganhos.toFixed(2)}\n- R$ ${gastos.toFixed(2)}\n= R$ ${saldo.toFixed(2)}\n`;

    message.reply(resumo);
}

function dataHoje() {
    return new Date().toISOString().split('T')[0];
}

client.initialize();
