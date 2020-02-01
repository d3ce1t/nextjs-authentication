import * as authorization from 'auth-header';
import nextCookie from 'next-cookies';
import jwt from 'jsonwebtoken';

const oneYearDuration = 3600 * 24 * 365 // 1 year

export function newAccessToken(userId, { secret, issuer, maxAge = oneYearDuration }) {
    const token = jwt.sign({ uid: userId, iss: issuer, aud: 'web' }, secret);
    const cookie = newSessionCookie(token, maxAge);
    return [token, cookie];
}

function newSessionCookie(accessToken, maxAge) {
    return `access_token=${accessToken}; Path=/; Max-Age=${maxAge} SameSite=Strict; HttpOnly`;
}

export function getDecodedAccessToken(req, res, config) {

    const accessToken = getAccessToken(req, res);
    if (accessToken === null) {
        return null;
    }

    const { secret, issuer } = config;

    try {
        if (typeof req !== 'undefined') {
            const decoded = jwt.verify(accessToken, secret, { issuer });
            return { ...decoded, token: accessToken, verified: true };
        } else {
            // NOTE: Token verification can't be done in browser because config.app.secret
            // isn't available there (and it should't).
            const decoded = jwt.decode(accessToken);
            return { ...decoded, token: accessToken, verified: false };
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}

function getAccessToken(req, res) {
    return getAccessTokenFromHeader(req) || getAccessTokenFromCookie(req, res);
}

function getAccessTokenFromHeader(req) {

    if (!req) return null;

    const authHeader = req.headers.authorization; // nextjs
    if (!authHeader) {
        return null;
    }

    const auth = authorization.parse(authHeader);
    if (auth.scheme !== 'Bearer') {
        return null;
    }

    return auth.token || null;
}

function getAccessTokenFromCookie(req, res) {
    const cookies = nextCookie({ req, res });
    return cookies.access_token || null;
}