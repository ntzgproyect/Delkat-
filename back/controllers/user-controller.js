const userService = require('../services/user-service');

// login
async function login(req, res, next) {
  const { mail, password } = req.body;

  try {
    const accesToken = await userService.login(mail, password);
    res.status(200).send(accesToken);
  } catch (error) {
    next(error);
  }
}

// logout
async function logout(req, res) {
  console.log('eliminando token');
  res.cookie('jwt', '', {maxAge: 1});
  res.redirect('/');
};

// crear usuario
async function createUser(req, res) {
  const {
    firstName, lastName, dni, mail, password
  } = req.body;

  const user = await userService.userRegister(firstName, lastName, dni, mail, password);

  res.status(201).send(user);
}

// cambiar estado de vendedor

async function cambiarEstadoVendedorUser(req, res, next) {
  const { id } = req.params;
  const { estadoDeVendedor } = req.body;
  try {
    const user = await userService.cambiarEstadoVendedor(id, estadoDeVendedor);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
}

module.exports = { login, createUser, cambiarEstadoVendedorUser, logout };
