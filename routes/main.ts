import { ServerRoute } from '@hapi/hapi'

const home: ServerRoute = {
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        request.logger.info('In handler %s', request.path)

        return h.view('home');
    }
}

export default [
    home
];