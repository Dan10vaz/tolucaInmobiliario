import bcrypt from "bcrypt";
const usuarios = [
  {
    nombre: "Cesar Dominguez",
    email: "cesar_dominguez@tolucagrupoinmobiliario.com",
    telefono: "7291284427",
    confirmado: 1,
    password: bcrypt.hashSync("CesarDom12", 10),
  },
];

export default usuarios;
