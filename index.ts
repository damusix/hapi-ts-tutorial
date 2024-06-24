import Hapi from '@hapi/hapi';
import Exiting from 'exiting';

import { dependencyInjectServer } from './helpers/hapi';

import Plugins from './plugins';
import Routes from './routes';
import Methods from './methods';

export const deployment = async () => {

    const server = Hapi.server({

        port: 3000,
        host: 'localhost',
        debug: false
    });

    await server.register(

        await dependencyInjectServer(server, Plugins)
    );

    server.method(

        await dependencyInjectServer(server, Methods)
    );

    server.route(

        await dependencyInjectServer(server, Routes)
    );

    /**
     * Create a new Exiting manager.
     *
     * This will handle the server shutdown and
     * exit signal capture.
     */
    const manager = Exiting.createManager(server, { exitTimeout: 30 * 1000 });

    await server.initialize();
    await manager.start();

    return server;
}

if (require.main === module) {

    deployment();
}