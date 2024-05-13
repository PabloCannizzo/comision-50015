const config = require("../config/config.js");

let DAO; 

switch(config.persistencia){
    case "mongo":
        DAO = require("./db/product-manager-db.js");
        break;
    //case "memory":
        DAO = require("./memoryJugueteDAO.js");
        //break;
    case "file":
        DAO = require("./fs/product-manager.js");
        break;
    default: 
        throw new Error("Persistencia no valida");
}

module.exports = DAO; 