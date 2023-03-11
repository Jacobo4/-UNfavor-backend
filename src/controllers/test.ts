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

};

module.exports = controller;