import bcrypt from 'bcrypt';
const usuarios = [
    {
        nombre: 'Daniel',
        email: 'dcva9565@hotmail.com',
        telefono: '5613117007',
        confirmado: 1,
        password: bcrypt.hashSync('123456', 10),
    },
]

export default usuarios;