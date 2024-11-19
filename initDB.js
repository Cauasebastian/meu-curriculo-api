// initDB.js
const pool = require('./db');

const createTables = async () => {
    const queries = `
        -- Tabela de Currículos
        CREATE TABLE IF NOT EXISTS curriculos (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Tabela de Informações Pessoais
        CREATE TABLE IF NOT EXISTS personal_info (
            id SERIAL PRIMARY KEY,
            curriculo_id INTEGER REFERENCES curriculos(id) ON DELETE CASCADE,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            address VARCHAR(255),
            linkedin VARCHAR(255),
            github VARCHAR(255),
            UNIQUE(curriculo_id)
        );

        -- Tabela de Educação
        CREATE TABLE IF NOT EXISTS education (
            id SERIAL PRIMARY KEY,
            curriculo_id INTEGER REFERENCES curriculos(id) ON DELETE CASCADE,
            institution VARCHAR(255) NOT NULL,
            degree VARCHAR(100),
            field_of_study VARCHAR(100),
            start_date DATE,
            end_date DATE,
            description TEXT
        );

        -- Tabela de Experiência Profissional
        CREATE TABLE IF NOT EXISTS experience (
            id SERIAL PRIMARY KEY,
            curriculo_id INTEGER REFERENCES curriculos(id) ON DELETE CASCADE,
            company VARCHAR(255) NOT NULL,
            position VARCHAR(100),
            start_date DATE,
            end_date DATE,
            description TEXT
        );

        -- Tabela de Habilidades
        CREATE TABLE IF NOT EXISTS skills (
            id SERIAL PRIMARY KEY,
            curriculo_id INTEGER REFERENCES curriculos(id) ON DELETE CASCADE,
            name VARCHAR(100) NOT NULL,
            proficiency VARCHAR(50)
        );

        -- Tabela de Projetos
        CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            curriculo_id INTEGER REFERENCES curriculos(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            url VARCHAR(255)
        );

        -- Tabela de Certificações
        CREATE TABLE IF NOT EXISTS certifications (
            id SERIAL PRIMARY KEY,
            curriculo_id INTEGER REFERENCES curriculos(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            issuer VARCHAR(255),
            date DATE,
            credential_id VARCHAR(100),
            url VARCHAR(255)
        );

        -- Tabela de Idiomas
        CREATE TABLE IF NOT EXISTS languages (
            id SERIAL PRIMARY KEY,
            curriculo_id INTEGER REFERENCES curriculos(id) ON DELETE CASCADE,
            name VARCHAR(100) NOT NULL,
            proficiency VARCHAR(50)
        );
    `;

    try {
        await pool.query(queries);
        console.log("Tabelas criadas ou já existentes.");
    } catch (err) {
        console.error("Erro ao criar tabelas:", err);
        process.exit(1); // Encerra o processo em caso de erro
    }
};

module.exports = createTables;
