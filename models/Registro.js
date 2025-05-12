const mongoose = require('mongoose');

const RegistroSchema = new mongoose.Schema({
    tipo: { type: String, enum: ['ganho', 'gasto'], required: true },
    valor: Number,
    descricao: String,
    categoria: String,
    data: { type: Date, default: Date.now },
    usuario: String,
});

module.exports = mongoose.model('Registro', RegistroSchema);
