import catchAsync from '@/utils/catchAsync';
import { projectService } from './project.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { cloudinaryConfig } from '@/utils/uploadFile';

const parseNestedPayload = (body: any) => {
  const payload = { ...body };
  const jsonFields = ['overview', 'process', 'testimonial', 'tags'];

  for (const field of jsonFields) {
    if (typeof payload[field] === 'string') {
      try {
        payload[field] = JSON.parse(payload[field]);
      } catch {}
    }
  }

  return payload;
};

const createProject = catchAsync(async (req, res) => {
  const normalizedBody = parseNestedPayload(req.body);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

  if (files?.poster?.[0]) {
    const posterResult = await cloudinaryConfig.uploadFileToCloudinary(
      files.poster[0].buffer,
      files.poster[0].originalname,
      { folder: 'projects/posters' }
    );
    normalizedBody.poster = posterResult.secure_url;
  }

  if (files?.processImage?.[0]) {
    const processResult = await cloudinaryConfig.uploadFileToCloudinary(
      files.processImage[0].buffer,
      files.processImage[0].originalname,
      { folder: 'projects/process' }
    );
    if (!normalizedBody.process) normalizedBody.process = {};
    normalizedBody.process.image = processResult.secure_url;
  }

  const data = await projectService.createProject(normalizedBody);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Project created successfully',
    data,
  });
});

const getAllProjects = catchAsync(async (_req, res) => {
  const data = await projectService.getAllProjects();

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Projects fetched successfully',
    data,
  });
});

const getTrashedProjects = catchAsync(async (_req, res) => {
  const data = await projectService.getTrashedProjects();

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Trashed projects fetched successfully',
    data,
  });
});

const getProjectBySlug = catchAsync(async (req, res) => {
  const data = await projectService.getProjectBySlug(req.params.slug);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Project fetched successfully',
    data,
  });
});

const getProjectById = catchAsync(async (req, res) => {
  const data = await projectService.getProjectById(req.params.id);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Project fetched successfully',
    data,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const payload = parseNestedPayload(req.body);
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

  if (files?.poster?.[0]) {
    const posterResult = await cloudinaryConfig.uploadFileToCloudinary(
      files.poster[0].buffer,
      files.poster[0].originalname,
      { folder: 'projects/posters' }
    );
    payload.poster = posterResult.secure_url;
  }

  if (files?.processImage?.[0]) {
    const processResult = await cloudinaryConfig.uploadFileToCloudinary(
      files.processImage[0].buffer,
      files.processImage[0].originalname,
      { folder: 'projects/process' }
    );
    if (!payload.process) payload.process = {};
    payload.process.image = processResult.secure_url;
  }

  const data = await projectService.updateProject(req.params.id, payload);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Project updated successfully',
    data,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const data = await projectService.deleteProject(req.params.id);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Project moved to trash',
    data,
  });
});

const restoreProject = catchAsync(async (req, res) => {
  const data = await projectService.restoreProject(req.params.id);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Project restored successfully',
    data,
  });
});

const permanentDeleteProject = catchAsync(async (req, res) => {
  const data = await projectService.permanentDeleteProject(req.params.id);

  return sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Project permanently deleted',
    data,
  });
});

export const projectController = {
  createProject,
  getAllProjects,
  getTrashedProjects,
  getProjectBySlug,
  getProjectById,
  updateProject,
  deleteProject,
  restoreProject,
  permanentDeleteProject,
};
