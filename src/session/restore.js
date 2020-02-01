import { getDecodedAccessToken } from './token';

export default function restoreSession(req, res, config = {}) {

    const session = { uid: null, authenticated: false };

    if (typeof req === 'undefined') {
        return session;
    }

    const decodedToken = getDecodedAccessToken(req, res, config);
    if (decodedToken !== null && decodedToken.verified) {
        session.token = decodedToken.token;
        session.uid = decodedToken.uid;
        session.authenticated = true;
    }

    return session;
}

