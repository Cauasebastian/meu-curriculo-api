// controllers/curriculoController.js
const pool = require('../db');

// Função para obter todos os currículos
const getAllCurriculos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM curriculos ORDER BY id ASC');
        const curriculos = [];

        for (const curriculo of result.rows) {
            const curriculoId = curriculo.id;

            const personalInfo = await pool.query('SELECT * FROM personal_info WHERE curriculo_id = $1', [curriculoId]);
            const education = await pool.query('SELECT * FROM education WHERE curriculo_id = $1 ORDER BY start_date DESC', [curriculoId]);
            const experience = await pool.query('SELECT * FROM experience WHERE curriculo_id = $1 ORDER BY start_date DESC', [curriculoId]);
            const skills = await pool.query('SELECT * FROM skills WHERE curriculo_id = $1 ORDER BY name ASC', [curriculoId]);
            const projects = await pool.query('SELECT * FROM projects WHERE curriculo_id = $1 ORDER BY name ASC', [curriculoId]);
            const certifications = await pool.query('SELECT * FROM certifications WHERE curriculo_id = $1 ORDER BY date DESC', [curriculoId]);
            const languages = await pool.query('SELECT * FROM languages WHERE curriculo_id = $1 ORDER BY name ASC', [curriculoId]);

            const curriculoCompleto = {
                id: curriculo.id,
                created_at: curriculo.created_at,
                updated_at: curriculo.updated_at,
                personal_info: personalInfo.rows[0] || null,
                education: education.rows,
                experience: experience.rows,
                skills: skills.rows,
                projects: projects.rows,
                certifications: certifications.rows,
                languages: languages.rows
            };

            curriculos.push(curriculoCompleto);
        }

        res.json(curriculos);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Erro no servidor.');
    }
};

// Função para obter um currículo por ID
const getCurriculoById = async (req, res) => {
    const { id } = req.params;
    try {
        const curriculoResult = await pool.query('SELECT * FROM curriculos WHERE id = $1', [id]);

        if (curriculoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Currículo não encontrado.' });
        }

        const curriculo = curriculoResult.rows[0];
        const curriculoId = curriculo.id;

        const personalInfo = await pool.query('SELECT * FROM personal_info WHERE curriculo_id = $1', [curriculoId]);
        const education = await pool.query('SELECT * FROM education WHERE curriculo_id = $1 ORDER BY start_date DESC', [curriculoId]);
        const experience = await pool.query('SELECT * FROM experience WHERE curriculo_id = $1 ORDER BY start_date DESC', [curriculoId]);
        const skills = await pool.query('SELECT * FROM skills WHERE curriculo_id = $1 ORDER BY name ASC', [curriculoId]);
        const projects = await pool.query('SELECT * FROM projects WHERE curriculo_id = $1 ORDER BY name ASC', [curriculoId]);
        const certifications = await pool.query('SELECT * FROM certifications WHERE curriculo_id = $1 ORDER BY date DESC', [curriculoId]);
        const languages = await pool.query('SELECT * FROM languages WHERE curriculo_id = $1 ORDER BY name ASC', [curriculoId]);

        const curriculoCompleto = {
            id: curriculo.id,
            created_at: curriculo.created_at,
            updated_at: curriculo.updated_at,
            personal_info: personalInfo.rows[0] || null,
            education: education.rows,
            experience: experience.rows,
            skills: skills.rows,
            projects: projects.rows,
            certifications: certifications.rows,
            languages: languages.rows
        };

        res.json(curriculoCompleto);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Erro no servidor.');
    }
};

// Função para criar um novo currículo
const createCurriculo = async (req, res) => {
    const { personal_info, education, experience, skills, projects, certifications, languages } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Inserir no curriculos
        const curriculoResult = await client.query(
            `INSERT INTO curriculos DEFAULT VALUES RETURNING id, created_at, updated_at`
        );
        const curriculoId = curriculoResult.rows[0].id;

        // Inserir Informações Pessoais
        if (personal_info) {
            await client.query(
                `INSERT INTO personal_info (curriculo_id, name, email, phone, address, linkedin, github)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    curriculoId,
                    personal_info.name,
                    personal_info.email,
                    personal_info.phone,
                    personal_info.address,
                    personal_info.linkedin,
                    personal_info.github
                ]
            );
        }

        // Inserir Educação
        if (education && Array.isArray(education)) {
            for (const edu of education) {
                await client.query(
                    `INSERT INTO education (curriculo_id, institution, degree, field_of_study, start_date, end_date, description)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        curriculoId,
                        edu.institution,
                        edu.degree,
                        edu.field_of_study,
                        edu.start_date,
                        edu.end_date,
                        edu.description
                    ]
                );
            }
        }

        // Inserir Experiência
        if (experience && Array.isArray(experience)) {
            for (const exp of experience) {
                await client.query(
                    `INSERT INTO experience (curriculo_id, company, position, start_date, end_date, description)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        curriculoId,
                        exp.company,
                        exp.position,
                        exp.start_date,
                        exp.end_date,
                        exp.description
                    ]
                );
            }
        }

        // Inserir Habilidades
        if (skills && Array.isArray(skills)) {
            for (const skill of skills) {
                await client.query(
                    `INSERT INTO skills (curriculo_id, name, proficiency)
                     VALUES ($1, $2, $3)`,
                    [
                        curriculoId,
                        skill.name,
                        skill.proficiency
                    ]
                );
            }
        }

        // Inserir Projetos
        if (projects && Array.isArray(projects)) {
            for (const project of projects) {
                await client.query(
                    `INSERT INTO projects (curriculo_id, name, description, url)
                     VALUES ($1, $2, $3, $4)`,
                    [
                        curriculoId,
                        project.name,
                        project.description,
                        project.url
                    ]
                );
            }
        }

        // Inserir Certificações
        if (certifications && Array.isArray(certifications)) {
            for (const cert of certifications) {
                await client.query(
                    `INSERT INTO certifications (curriculo_id, name, issuer, date, credential_id, url)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        curriculoId,
                        cert.name,
                        cert.issuer,
                        cert.date,
                        cert.credential_id,
                        cert.url
                    ]
                );
            }
        }

        // Inserir Idiomas
        if (languages && Array.isArray(languages)) {
            for (const lang of languages) {
                await client.query(
                    `INSERT INTO languages (curriculo_id, name, proficiency)
                     VALUES ($1, $2, $3)`,
                    [
                        curriculoId,
                        lang.name,
                        lang.proficiency
                    ]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Currículo criado com sucesso.', curriculo_id: curriculoId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error.message);
        res.status(500).send('Erro no servidor.');
    } finally {
        client.release();
    }
};

// Função para atualizar um currículo existente
const updateCurriculo = async (req, res) => {
    const { id } = req.params;
    const { personal_info, education, experience, skills, projects, certifications, languages } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Verificar se o currículo existe
        const curriculoResult = await client.query('SELECT * FROM curriculos WHERE id = $1', [id]);

        if (curriculoResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Currículo não encontrado.' });
        }

        // Atualizar o campo updated_at
        await client.query(
            `UPDATE curriculos SET updated_at = NOW() WHERE id = $1`,
            [id]
        );

        // Atualizar Informações Pessoais
        if (personal_info) {
            const personalInfoResult = await client.query(
                `SELECT * FROM personal_info WHERE curriculo_id = $1`,
                [id]
            );

            if (personalInfoResult.rows.length === 0) {
                // Inserir se não existir
                await client.query(
                    `INSERT INTO personal_info (curriculo_id, name, email, phone, address, linkedin, github)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        id,
                        personal_info.name,
                        personal_info.email,
                        personal_info.phone,
                        personal_info.address,
                        personal_info.linkedin,
                        personal_info.github
                    ]
                );
            } else {
                // Atualizar existente
                await client.query(
                    `UPDATE personal_info
                     SET name = $1, email = $2, phone = $3, address = $4, linkedin = $5, github = $6
                     WHERE curriculo_id = $7`,
                    [
                        personal_info.name,
                        personal_info.email,
                        personal_info.phone,
                        personal_info.address,
                        personal_info.linkedin,
                        personal_info.github,
                        id
                    ]
                );
            }
        }

        // Atualizar Educação
        if (education && Array.isArray(education)) {
            // Deletar todas as entradas atuais
            await client.query('DELETE FROM education WHERE curriculo_id = $1', [id]);

            // Inserir novamente
            for (const edu of education) {
                await client.query(
                    `INSERT INTO education (curriculo_id, institution, degree, field_of_study, start_date, end_date, description)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        id,
                        edu.institution,
                        edu.degree,
                        edu.field_of_study,
                        edu.start_date,
                        edu.end_date,
                        edu.description
                    ]
                );
            }
        }

        // Atualizar Experiência
        if (experience && Array.isArray(experience)) {
            await client.query('DELETE FROM experience WHERE curriculo_id = $1', [id]);

            for (const exp of experience) {
                await client.query(
                    `INSERT INTO experience (curriculo_id, company, position, start_date, end_date, description)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        id,
                        exp.company,
                        exp.position,
                        exp.start_date,
                        exp.end_date,
                        exp.description
                    ]
                );
            }
        }

        // Atualizar Habilidades
        if (skills && Array.isArray(skills)) {
            await client.query('DELETE FROM skills WHERE curriculo_id = $1', [id]);

            for (const skill of skills) {
                await client.query(
                    `INSERT INTO skills (curriculo_id, name, proficiency)
                     VALUES ($1, $2, $3)`,
                    [
                        id,
                        skill.name,
                        skill.proficiency
                    ]
                );
            }
        }

        // Atualizar Projetos
        if (projects && Array.isArray(projects)) {
            await client.query('DELETE FROM projects WHERE curriculo_id = $1', [id]);

            for (const project of projects) {
                await client.query(
                    `INSERT INTO projects (curriculo_id, name, description, url)
                     VALUES ($1, $2, $3, $4)`,
                    [
                        id,
                        project.name,
                        project.description,
                        project.url
                    ]
                );
            }
        }

        // Atualizar Certificações
        if (certifications && Array.isArray(certifications)) {
            await client.query('DELETE FROM certifications WHERE curriculo_id = $1', [id]);

            for (const cert of certifications) {
                await client.query(
                    `INSERT INTO certifications (curriculo_id, name, issuer, date, credential_id, url)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        id,
                        cert.name,
                        cert.issuer,
                        cert.date,
                        cert.credential_id,
                        cert.url
                    ]
                );
            }
        }

        // Atualizar Idiomas
        if (languages && Array.isArray(languages)) {
            await client.query('DELETE FROM languages WHERE curriculo_id = $1', [id]);

            for (const lang of languages) {
                await client.query(
                    `INSERT INTO languages (curriculo_id, name, proficiency)
                     VALUES ($1, $2, $3)`,
                    [
                        id,
                        lang.name,
                        lang.proficiency
                    ]
                );
            }
        }

        await client.query('COMMIT');
        res.json({ message: 'Currículo atualizado com sucesso.' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error.message);
        res.status(500).send('Erro no servidor.');
    } finally {
        client.release();
    }
};

// Função para deletar um currículo
const deleteCurriculo = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await pool.query('DELETE FROM curriculos WHERE id = $1 RETURNING *', [id]);

        if (deleteResult.rows.length === 0) {
            return res.status(404).json({ message: 'Currículo não encontrado.' });
        }

        res.json({ message: 'Currículo deletado com sucesso.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Erro no servidor.');
    }
};

module.exports = {
    getAllCurriculos,
    getCurriculoById,
    createCurriculo,
    updateCurriculo,
    deleteCurriculo
};
