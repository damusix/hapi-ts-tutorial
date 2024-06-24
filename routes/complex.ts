import {
    ServerRoute,
    Lifecycle
} from '@hapi/hapi';

/**
 * We define a common type that will be used throughout
 * the routes file.
 */
type UserPass = {
    username: string;
    password: string | null;
}

/**
 * Setup references for the routes and lifecycle methods.
 */
type AuthRefs = {
    Payload: {
        username: string;
        password: string;
    };
    Query: {
        username: string;
    };
}

/**
 * Login route type definition.
 */
type LoginRoute = ServerRoute<{
    Payload: {
        username: string;
        password: string;
    };
    Pres: {
        user: UserPass;
    }
}>

/**
 * Logout route type definition.
 */
type LogoutRoute = ServerRoute<{
    Query: {
        username: string;
    };
    Pres: {
        user: UserPass;
    }
}>;

/**
 * Pre-request utility method to extract the user
 */
const extractUser: Lifecycle.Method<AuthRefs, UserPass> = (request, h) => {

    let username: string;
    let password: string | null;

    if (request.payload) {

        username = request.payload.username;
        password = request.payload?.password || null;

    }
    else {

        username = request.query.username;
    }

    request.logger.info('Extracted user %s', username);

    return {
        username,
        password
    };
}

/**
 * Login route definition.
 */
const login: LoginRoute = {
    method: 'POST',
    path: '/login',
    options: {
        pre: [
            { assign: 'user', method: extractUser }
        ]
    },
    handler: async (request, h) => {

        const { username } = request.pre.user;

        request.logger.info(request.pre.user, 'Login attempt');

        return h.view('login', { username });
    }
}

/**
 * Logout route definition.
 */
const logout: LogoutRoute = {
    method: 'GET',
    path: '/logout',
    options: {
        pre: [
            { assign: 'user', method: extractUser }
        ]
    },
    handler: async (request, h) => {

        const { username } = request.pre.user;

        request.logger.info('Logout for %s', username);

        return h.view('home')
    }
}

export default [
    login,
    logout
];