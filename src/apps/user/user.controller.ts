import userService from "./user.service";

const userController = {
    getUser: async function (req, res) {
        try{
            var user = await userService.getInfo(req.user.id);
        }catch(error){
            console.log("ERROR: ", error.message);
            return res.status(401).send({ message: error.message, error });
        }
        res.status(200).send({
            message: "User found",
            user: user,
        });
    },
    signup: async function (req, res) {
        try{
            var user = await userService.signup(req.body.user);
            var favor = await userService.createFavor(req.body.favor);
            res.status(200).send({
                message: "Saved user",
                userInfo: user,
                favorInfo: favor,
            });
        }catch (error) {
            console.log("ERROR: ", error.message);
            res.status(500).send({ message: error.message, error });
        }
    },

    login: async function (req, res) {

        try{
            var { user, tokens } = await userService.login(req.body);
        }catch(error){
            console.log("ERROR: ", error.message);
            return res.status(401).send({ message: error.message, error });
        }

        if(!user) return res.status(401).send({ message: "Invalid credentials" });
        if(!tokens) return res.status(500).send({message: "Error generating tokens"});

        res.header({'accesstoken': tokens.access, 'refreshtoken': tokens.refresh}).status(200).send({
            message: "Logged in",
            access: tokens.access,
            refresh: tokens.refresh,
        });

    },

    logout: async function (req, res) {
        try{
            var tokens = await userService.logout();
        }catch(error){
            console.log("ERROR: ", error.message);
            return res.status(401).send({ message: error.message, error });
        }
        res.status(200).send({
            message: "Logged out",
            access: tokens.access,
            refresh: tokens.refresh,
        });
    },

    refresh: async function (req, res) {
        try{
            var accessToken = await userService.refresh(req);
        }catch(error){
            console.log("ERROR: ", error.message);
            return res.status(401).send({ message: error.message, error });
        }
        res.header({'accesstoken': accessToken}).status(200).send({
            message: "Access token refreshed",
            access: accessToken,
        });
    },

    admin: async function (req, res) {
        res.status(200).send({
            message: "I'm authenticated. This is a protected route",
            user: req.user,
        });
    },

    post: async function (req, res) {
        try{
            var favor = await userService.createFavor(req.body);
        }catch(error){
            console.log("ERROR: ", error.message);
            return res.status(401).send({ message: error.message, error });
        }
        res.status(200).send({
            message: "Favor created",
            favor: favor,
        });
    }

}

export default userController;
