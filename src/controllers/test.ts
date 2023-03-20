var User = require("../models/user.ts");

var controller = {

    home: function (req, res) {
        return res.status(200).send({
            message: "Soy la home"
        });
    },

    test: function (req, res) {
        var id = req.params.id;

        if(id != undefined)
            return res.status(200).send({
                message: "Soy el test con id: "+id
            });
        else
            return res.status(200).send({
                message: "Soy el test"
            });
    },

    testDB: async function (req, res) {
        var user = new User();
        var params = req.body;
        user.name = params.name;
        user.age = params.age;
        user.phone = params.phone;
        user.email = params.email;

        try {
            const result = await user.save();
            if(result){
                console.log("Usuario guardado", result);
                return res.status(200).send({
                    message: "Usuario guardado",
                    userInfo: result,
                });
            }else{
                console.log("ALGO SALIO MAL", result);
            }
        }catch(err){
            console.log("Ocurrio un error: ", err);
            return res.status(500).send({
                message: "Error al guardar el usuario",
                error: err,
            });
        }
    }

};

module.exports = controller;