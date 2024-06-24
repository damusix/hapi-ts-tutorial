import Hapi, { ServerMethodConfigurationObject } from '@hapi/hapi';

import { logger } from '../plugins/logger';

declare module '@hapi/hapi' {

    interface ServerMethods {

        addTwoNumbers: (a: number, b: number) => Promise<number>;
        loginUser: (username: string, password: string) => boolean;
        logoutUser: (username: string) => void;
    }
}

const addTwoNumbers: Hapi.ServerMethods['addTwoNumbers'] = (a, b) => {

    return new Promise(resolve => {

        setTimeout(() => {

            logger.info('In addTwoNumbers method, adding %d and %d', a, b);
            resolve(a + b);
        }, 1000 * Math.random() * 5);
    })
}

const loginUser: Hapi.ServerMethods['loginUser'] = (username, password) => {

    logger.info('Logging in user');
    logger.info('Username: %s', username);
    logger.info('Password: %s', password);

    return true;
}

const logoutUser: Hapi.ServerMethods['logoutUser'] = (username) => {

    logger.info('Logging out user');
    logger.info('Username: %s', username);
};


const addTwoNumbersConf: ServerMethodConfigurationObject = {

    name: 'addTwoNumbers',
    method: addTwoNumbers,
    options: {
        cache: {
            expiresIn: 10000,
            generateTimeout: 2000
        }
    }
};

const loginUserConf: ServerMethodConfigurationObject = {

    name: 'loginUser',
    method: loginUser
}

const logoutUserConf: ServerMethodConfigurationObject = {

    name: 'logoutUser',
    method: logoutUser
}

export default [
    loginUserConf,
    logoutUserConf,
    addTwoNumbersConf
]