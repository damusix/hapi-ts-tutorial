import StaticRoutes from './static';
import MainRoutes from './main';
import Auth from './complex';
import Math from './math';

export default [
    ...StaticRoutes,
    ...MainRoutes,
    ...Auth,
    ...Math
];