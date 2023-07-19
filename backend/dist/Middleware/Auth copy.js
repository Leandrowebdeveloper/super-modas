"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const User_1 = require("../Model/User");
const authGuard = (req, res, next) => {
    if (getUser(req))
        return next();
    const authorization = getHeadersAuthorization(req);
    const token = getToken(authorization);
    if (token) {
        const key = isThisTokenValid(token);
        if (typeof key !== 'string' && typeof key !== 'undefined') {
            const { email } = key;
            setUser(req, email);
            return next();
        }
        return res.status(403).json({ error: 'Não sera possível acessar o sistema.' });
    }
    return res.status(403).json({ error: 'Efetue login para acessar o sistema.' });
    function getUser(req) {
        return req.session.auth;
    }
    function setUser(req, email) {
        const user = new User_1.User();
        user.findUnique(email).then(_user => (req.session.auth = _user));
    }
    function getHeadersAuthorization(req) {
        var _a;
        return (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    }
    function getToken(token) {
        if (typeof token === 'string') {
            return token === null || token === void 0 ? void 0 : token.split(' ')[1];
        }
    }
    function isThisTokenValid(token) {
        try {
            if (token) {
                const token$ = token.replace(/\"/g, '');
                return (0, jsonwebtoken_1.verify)(token$, String(process.env.TOKEN_SECRET));
            }
        }
        catch (error) {
            return undefined;
        }
    }
};
exports.authGuard = authGuard;
