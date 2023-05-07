import jwt from 'jsonwebtoken';

class JwtService{
    generate(id, email, admin, secret){
        const access = jwt.sign(
            {
                id: id,
                email: email,
                type: process.env.JWT_ACCESS,
                admin: admin,
                chat: secret,
            },
            process.env.SECRET_ACCESS_KEY,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRATION,
            }
        );

        const refresh = jwt.sign(
            {
                id: id,
                email: email,
                type: process.env.JWT_REFRESH,
                admin: admin,
                chat: secret,
            },
            process.env.SECRET_REFRESH_KEY,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRATION,
            }
        );

        return { access, refresh };
    }

    verify(token, type){
        if(jwt.decode(token).type != type) return null;
        if(type === process.env.JWT_REFRESH) return jwt.verify(token, process.env.SECRET_REFRESH_KEY);
        return jwt.verify(token, process.env.SECRET_ACCESS_KEY);
    }

    isAdmin(token){
        if(!token) return null;
        if(!jwt.decode(token).admin) return null;
        return jwt.verify(token, process.env.SECRET_ACCESS_KEY);
    }

    logout(){
        var access = jwt.sign({action: "LOGOUT"}, process.env.SECRET_ACCESS_KEY, {expiresIn: "1ms"});
        var refresh = jwt.sign({action: "LOGOUT"}, process.env.SECRET_REFRESH_KEY, {expiresIn: "1ms"});
        return {access, refresh};
    }

}

export default new JwtService();
