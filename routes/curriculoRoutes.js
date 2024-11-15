// routes/curriculoRoutes.js
const express = require('express');
const router = express.Router();
const curriculoController = require('../controllers/curriculoController');
const { body, validationResult } = require('express-validator');

// Middleware para validação
const validateCurriculo = [
    body('personal_info.name').notEmpty().withMessage('Nome é obrigatório.'),
    body('personal_info.email').isEmail().withMessage('Email inválido.'),
    // Adicione mais validações conforme necessário
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Curriculo:
 *       type: object
 *       required:
 *         - personal_info
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do currículo
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação do currículo
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do currículo
 *         personal_info:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             address:
 *               type: string
 *             linkedin:
 *               type: string
 *             github:
 *               type: string
 *         education:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               institution:
 *                 type: string
 *               degree:
 *                 type: string
 *               field_of_study:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *         experience:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *         skills:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               proficiency:
 *                 type: string
 *         projects:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *         certifications:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               issuer:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               credential_id:
 *                 type: string
 *               url:
 *                 type: string
 *         languages:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               proficiency:
 *                 type: string
 */

/**
 * @swagger
 * tags:
 *   name: Curriculos
 *   description: Operações relacionadas a currículos
 */

/**
 * @swagger
 * /api/curriculos:
 *   get:
 *     summary: Obter todos os currículos
 *     tags: [Curriculos]
 *     responses:
 *       200:
 *         description: Lista de currículos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curriculo'
 */
router.get('/', curriculoController.getAllCurriculos);

/**
 * @swagger
 * /api/curriculos/{id}:
 *   get:
 *     summary: Obter um currículo por ID
 *     tags: [Curriculos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do currículo
 *     responses:
 *       200:
 *         description: Currículo encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curriculo'
 *       404:
 *         description: Currículo não encontrado.
 */
router.get('/:id', curriculoController.getCurriculoById);

/**
 * @swagger
 * /api/curriculos:
 *   post:
 *     summary: Criar um novo currículo
 *     tags: [Curriculos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curriculo'
 *     responses:
 *       201:
 *         description: Currículo criado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       500:
 *         description: Erro no servidor.
 */
router.post('/', validateCurriculo, curriculoController.createCurriculo);

/**
 * @swagger
 * /api/curriculos/{id}:
 *   put:
 *     summary: Atualizar um currículo existente
 *     tags: [Curriculos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do currículo a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curriculo'
 *     responses:
 *       200:
 *         description: Currículo atualizado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       404:
 *         description: Currículo não encontrado.
 *       500:
 *         description: Erro no servidor.
 */
router.put('/:id', validateCurriculo, curriculoController.updateCurriculo);

/**
 * @swagger
 * /api/curriculos/{id}:
 *   delete:
 *     summary: Deletar um currículo
 *     tags: [Curriculos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do currículo a ser deletado
 *     responses:
 *       200:
 *         description: Currículo deletado com sucesso.
 *       404:
 *         description: Currículo não encontrado.
 *       500:
 *         description: Erro no servidor.
 */
router.delete('/:id', curriculoController.deleteCurriculo);

module.exports = router;
