import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const JWT_EXPIRES_IN = '1d';
export const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
//# sourceMappingURL=jwt.js.map