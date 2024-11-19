// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Importar Rotas
const curriculoRoutes = require('./routes/curriculoRoutes');

// Importar o script de inicialização do banco de dados
const createTables = require('./initDB');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do Swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Currículos",
            version: "1.0.0",
            description: "API para gerenciar múltiplos currículos."
        },
        servers: [
            {
                url: "http://localhost:" + process.env.PORT
            }
        ]
    },
    apis: ["./routes/*.js"]
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rotas
app.use('/api/curriculos', curriculoRoutes);

// Rota de Teste
app.get('/', (req, res) => {
    res.send('API de Currículo está funcionando!');
});

// Função para iniciar o servidor após a criação das tabelas
const startServer = async () => {
    await createTables(); // Cria as tabelas

    // Iniciar Servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
};

startServer();
