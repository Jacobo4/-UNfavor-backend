import jwt, { JwtPayload } from 'jsonwebtoken';


class JwtService {
  generate(id: string, email: string, admin: boolean, secret: string): { access: string; refresh: string } {
    const access = jwt.sign(
      {
        id: id,
        email: email,
        type: process.env.JWT_ACCESS,
        admin: admin,
        chat: secret,
      },
      process.env.SECRET_ACCESS_KEY as string,
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
      },
      process.env.SECRET_REFRESH_KEY as string,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      }
    );

    return { access, refresh };
  }

  verify(token: string, type: string): JwtPayload | null {
    if (jwt.decode(token)?.type !== type) return null;
    if (type === process.env.JWT_REFRESH) return jwt.verify(token, process.env.SECRET_REFRESH_KEY as string);
    return jwt.verify(token, process.env.SECRET_ACCESS_KEY as string);
  }

  isAdmin(token: string): JwtPayload | null {
    if (!token) return null;
    if (!jwt.decode(token)?.admin) return null;
    return jwt.verify(token, process.env.SECRET_ACCESS_KEY as string);
  }

  logout(): { access: string; refresh: string } {
    var access = jwt.sign({ action: "LOGOUT" }, process.env.SECRET_ACCESS_KEY as string, { expiresIn: "1ms" });
    var refresh = jwt.sign({ action: "LOGOUT" }, process.env.SECRET_REFRESH_KEY as string, { expiresIn: "1ms" });
    return { access, refresh };
  }
}

export default new JwtService();
