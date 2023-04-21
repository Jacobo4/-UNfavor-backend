import jwt from 'jsonwebtoken';

class JwtService{
    generate(id, email){
        const access = jwt.sign(
            {
                id: id,
                email: email,
                type: process.env.JWT_ACCESS,
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
            },
            process.env.SECRET_REFRESH_KEY,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRATION,
            }
        );

        return { access, refresh };
    }

    verify(token){
        if(jwt.decode(token).type === process.env.JWT_REFRESH) return jwt.verify(token, process.env.SECRET_REFRESH_KEY);
        return jwt.verify(token, process.env.SECRET_ACCESS_KEY);
    }

    logout(){
        var access = jwt.sign({action: "LOGOUT"}, process.env.SECRET_ACCESS_KEY, {expiresIn: "1ms"});
        var refresh = jwt.sign({action: "LOGOUT"}, process.env.SECRET_REFRESH_KEY, {expiresIn: "1ms"});
        return {access, refresh};
    }

}

export default new JwtService();
