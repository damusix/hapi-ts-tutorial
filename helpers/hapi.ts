import { Server } from '@hapi/hapi';

/**
 * Type for a function that depends on the server object to
 * load its configuration. This is useful for generating configuration
 * objects to build the server.
 */
export type ServerDependentFn<T = unknown> = (server: Server) => T;

/**
 * Extract configuration objects for the server by first
 * executing the units that require the server object
 * in order to load their configuration
 */
export const dependencyInjectServer = <T extends unknown>(server: Server, things: T[]) => {

    return Promise.all(

        things.map((thing) => {

            if (typeof thing === 'function') {

                return thing(server);
            }

            return thing;
        })
    )
};
