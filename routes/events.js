/*
    Event Routes
    /api/events
*/
const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { route } = require('./auth');


// TODAS tiene que estar valicaion de l JWT
router.use(validarJWT);

// Obtener eventos
router.get('/', getEventos)

// Crear nuevo evento
router.post(
    '/', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de fin es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento)

// Actualizar evento
router.put('/:id',actualizarEvento)

// Actualizar evento
router.delete('/:id', eliminarEvento)

module.exports = router;