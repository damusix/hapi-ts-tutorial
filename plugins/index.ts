import Inert from '@hapi/inert';

import VisionPlugin from './vision';
import LoggerPlugin from './logger';

export default [
    Inert,
    VisionPlugin,
    LoggerPlugin
]