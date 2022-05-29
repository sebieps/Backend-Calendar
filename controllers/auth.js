const bcrypt = require("bcryptjs");
const { responses } = require("express");
const { generarJWT } = require("../helpers/jwt");
const Usuario = require("../models/Usuario");



const crearUsuario = async (req, res = response) => {
  const {name, email, password } = req.body ;

  try {

    let usuario = await Usuario.findOne({email: email})
    if(usuario){
        return res.status(400).json({
            ok: false,
            msg: 'Un usuario ya tiene ese email'
        });
    }

    usuario = new Usuario(req.body);

    // Encriptar Contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );

    await usuario.save();
    
    //Generar JWT
    const token = await generarJWT(usuario.id, usuario.name)

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token: token
    });
  } catch (error) {
      res.status(500).json({
          ok: false,
          msg: 'Por favor hable con el admin'
      })
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;
    
    try {
        
        const usuario = await Usuario.findOne({email: email})
        
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario o la contraseña no son correctos'
            });
        }   

        // confirmar las contraseñas:
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario o la contraseña no son correctos'
            });
        }

        // Generar nuestro JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }

  
};

const revalidarToken = async (req, res = response) => {

  const {uid, name } = req;

  // Generar nuestro JWT
  const token = await generarJWT(uid, name)


  res.json({
    ok: true,
    token
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
