import Joi from 'joi';
import {
    ServerRoute,
} from '@hapi/hapi';


type MathRoute = ServerRoute<{
    Params: {
        a: number;
        b: number;
    };
}>

const math: MathRoute = {
    method: 'GET',
    path: '/add/{a}/{b}',
    options: {
        validate: {
            params: Joi.object({
                a: Joi.number().required(),
                b: Joi.number().required()
            })
        }
    },
    handler: async (request, h) => {

        const { a, b } = request.params;

        const start = Date.now();

        request.logger.info(request.params, 'Adding stuff');

        const answer = await request.server.methods.addTwoNumbers(a, b);

        request.logger.info('Answer: %s', answer);
        request.logger.info('Time taken: %s', Date.now() - start);

        return answer;
    }
}

export default [
    math
];