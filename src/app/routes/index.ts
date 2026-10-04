import { Router } from 'express';
import userRouter from '../modules/user/user.route';
import authRouter from '../modules/auth/auth.route';
import projectRouter from '../modules/project/project.route';

const router = Router();

const routes = [
  {
    path: '/users',
    router: userRouter,
  },
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/projects',
    router: projectRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
