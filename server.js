// server.js
require('dotenv').config();
const express = require('express');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: false
    },
    port: parseInt(process.env.DB_PORT) || 1433
};

app.use(express.json());
app.use(express.static('public')); // Servir arquivos estáticos da pasta 'public'

// Rota GET  para Consulta de Usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        const result = await request.query('SELECT IDUsuario, Nome, Email FROM dbo.Usuarios'); // Selecionando menos campos para simplificar
        res.json(result.recordset);
    } catch (err) {
        console.error("Erro ao consultar usuários:", err.message);
        res.status(500).send('Erro no servidor ao consultar usuários.');
    } finally {
        sql.close();
    }
});

app.listen(port, () => {
    console.log(`Servidor de back-end rodando em http://localhost:${port}`);
    console.log(`Acesse a aplicação web em http://localhost:${port}/index.html`);
});