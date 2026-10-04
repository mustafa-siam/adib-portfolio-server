import { Router } from 'express';
import { projectController } from './project.controller';
import validateRequest from '@/app/middlewares/validateRequest';
import { projectSchema } from './project.schema';
import { defineRoutes } from '@/utils/defineRoutes';
import { authMiddleware } from '../auth/auth.middleware';
import { commonSchema } from '@/app/schema/common.schema';
import { upload } from '@/utils/multer';
import { parseFormDataJson } from '@/utils/parseFormDataJson';

const projectRouter = Router();

defineRoutes(projectRouter, [
  /* =====================================================
     PUBLIC ROUTES
  ===================================================== */
  {
    method: 'get',
    path: '/',
    handler: projectController.getAllProjects,
  },

  /* =====================================================
     ADMIN TRASH ROUTE — before /:slug
  ===================================================== */
  {
    method: 'get',
    path: '/trash',
    middlewares: [authMiddleware.requireAuth(), authMiddleware.requireAdmin],
    handler: projectController.getTrashedProjects,
  },

  {
    method: 'post',
    path: '/create',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      upload.fields([
        { name: 'poster', maxCount: 1 },
        { name: 'processImage', maxCount: 1 },
      ]),
      parseFormDataJson, // must run BEFORE validation
      validateRequest(projectSchema.createProject),
    ],
    handler: projectController.createProject,
  },

  /* =====================================================
     PUBLIC SLUG ROUTE
  ===================================================== */
  {
    method: 'get',
    path: '/:slug',
    handler: projectController.getProjectBySlug,
  },

  /* =====================================================
     ADMIN ID-BASED ROUTES
  ===================================================== */
  {
    method: 'get',
    path: '/id/:id',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(commonSchema.idSchema),
    ],
    handler: projectController.getProjectById,
  },

  {
    method: 'patch',
    path: '/id/:id',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      upload.fields([
        { name: 'poster', maxCount: 1 },
        { name: 'processImage', maxCount: 1 },
      ]),
      parseFormDataJson, // must run BEFORE validation
      validateRequest(commonSchema.idSchema),
      validateRequest(projectSchema.updateProject),
    ],
    handler: projectController.updateProject,
  },

  {
    method: 'delete',
    path: '/id/:id',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(commonSchema.idSchema),
    ],
    handler: projectController.deleteProject,
  },

  {
    method: 'patch',
    path: '/id/:id/restore',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(commonSchema.idSchema),
    ],
    handler: projectController.restoreProject,
  },

  {
    method: 'delete',
    path: '/id/:id/permanent',
    middlewares: [
      authMiddleware.requireAuth(),
      authMiddleware.requireAdmin,
      validateRequest(commonSchema.idSchema),
    ],
    handler: projectController.permanentDeleteProject,
  },
]);

export default projectRouter;
