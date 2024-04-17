const generarInfoError = (usuario) => {
    return ` Los datos estan incompletos o no son válidos. 
    Necesitamos recibir los siguientes datos: 
    - Nombre: String, peero recibimos ${usuario.first_name}
    - Apellido: String, peeero recibimos ${usuario.last_name}
    - Email: String, recibimos ${usuario.email}
    `
}

module.exports = {
    generarInfoError
}