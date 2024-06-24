import Path from 'path'
import Ejs from 'ejs';

import {
    Plugin,
    Request,
    ResponseObject,
    ResponseToolkit,
    Server,
    ServerRegisterPluginObject
} from '@hapi/hapi';

import Vision from '@hapi/vision'
import Hoek from '@hapi/hoek';

import ViewHelpers from '../views/helpers';
import { ServerDependentFn } from '../helpers/hapi';

const fromViews = (...paths: string[]) => Path.join(__dirname, '../views', ...paths);

const visionConfig: ServerDependentFn<
    ServerRegisterPluginObject<Vision.ServerViewsConfiguration>
> = () => {

    const ejsOptions: Ejs.Options = {

        views: [
            fromViews(),
        ],
        debug: !!process.env.DEBUG
    }

    return {
        plugin: Vision,
        options: {

            engines: {
                html: Ejs,
                ejs: Ejs
            },
            relativeTo: fromViews(),
            path: `./pages`,
            layoutPath: `./layouts`,
            partialsPath: `./partials`,
            layout: './main',
            defaultExtension: 'ejs',
            runtimeOptions: ejsOptions,
            compileOptions: ejsOptions,
            context: {

                ...ViewHelpers
            }
        }
    };
}

export default visionConfig;