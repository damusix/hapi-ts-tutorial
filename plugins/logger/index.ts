/**
 * NOTE: This is a simple example of a logger for the purpose of this tutorial.
 *
 * In a real-world application, you should consider using a more robust plugin like
 * `hapi-pino` for logging.
 */

import Pino from 'pino';
import Boom from '@hapi/boom';
import { Plugin, ResponseObject } from '@hapi/hapi';

const transport = Pino.transport({
    target: 'pino-pretty'
});

export const logger = Pino(transport);

/**
 * Extending the request and server interfaces to include the logger
 * property.
 *
 * You want to declare your custom properties in the place where you
 * define them. This allows you to more easily find where it is they
 * are implemented.
 */
declare module '@hapi/hapi' {

    interface Request {
        logger: Pino.Logger;
    }

    interface Server {
        logger: Pino.Logger;
    }
}

export const plugin: Plugin<{}> = {

    name: 'app/logger',
    register: async (server, options) => {

        server.decorate('request', 'logger', logger as any);
        server.decorate('server', 'logger', logger as any);

        server.events.on('log', (event, tags) => {

            const {
                data,
                timestamp,
                tags: eventTags,
                channel,
                error
            } = event;

            const log: any = {
                tags: eventTags,
                data,
                timestamp,
                channel,
                error,
            };

            if (tags.error) {

                logger.error(log, 'Error event');
                return;
            }

            if (tags.warn) {

                logger.warn(log, 'Warning event');
                return;
            }

            if (tags.info) {

                logger.info(log, 'Info event');
                return;
            }

            logger.debug(log, 'Debug event');
        });

        server.events.on('route', (route) => {

            const { method, path, settings } = route;

            logger.info({
                method,
                path,
                auth: settings.auth
            }, 'Route added');
        });

        server.events.on('response', (request) => {

            const { method, url, info, route } = request;
            const { path } = route;

            const asError = request.response as Boom.Boom;
            const asRes = request.response as ResponseObject;

            let { remoteAddress } = info;
            let { statusCode } = asRes as ResponseObject;

            if (request.headers['x-forwarded-for']) {

                remoteAddress = request.headers['x-forwarded-for'];
            }

            let errorPayload: Boom.Payload | null = null;
            let errorMsg: string | null = null;
            let errorCause: string | null = null;

            const err = (asRes as any)._error;
            const hasError = asError.isBoom || err;

            if (hasError) {

                statusCode = err.output.statusCode;
                errorPayload = err.output.payload;
                errorMsg = err.message;
                errorCause = err.data;
            }


            const msg = `${method.toUpperCase()} ${url} ${statusCode}`

            const log: any = {
                method,
                url,
                statusCode,
                remoteAddress,
                path
            }


            if (hasError) {

                log.error = {
                    message: errorMsg,
                    cause: errorCause,
                    payload: errorPayload
                }
            }

            if (statusCode >= 400) {

                logger.error(log, msg)
                return;
            }

            logger.info(log, msg)
        });

        server.events.once('start', () => {

            logger.info('Server started', {
                host: server.info.host,
                port: server.info.port,
                uri: server.info.uri
            });
        });

        server.events.once('stop', () => {

            logger.info('Server stopped');
        });
    }
}

export default { plugin, logger };