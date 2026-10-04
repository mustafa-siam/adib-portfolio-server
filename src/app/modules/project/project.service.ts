import AppError from '@/app/errors/handlers/AppError';
import { StatusCodes } from 'http-status-codes';
import { IProject } from './project.schema';
import ProjectModel from './project.model';

const createProject = async (payload: IProject) => {
  return await ProjectModel.create(payload);
};

const getAllProjects = async () => {
  return await ProjectModel.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .lean();
};

const getTrashedProjects = async () => {
  return await ProjectModel.find({ isDeleted: true }).sort({ createdAt: -1 }).lean();
};

const getProjectBySlug = async (slug: string) => {
  const project = await ProjectModel.findOne({
    slug,
    isDeleted: { $ne: true },
  }).lean();

  if (!project) {
    throw new AppError('Project not found', StatusCodes.NOT_FOUND);
  }

  return project;
};

const getProjectById = async (id: string) => {
  const project = await ProjectModel.findById(id).lean();

  if (!project) {
    throw new AppError('Project not found', StatusCodes.NOT_FOUND);
  }

  return project;
};

const updateProject = async (id: string, payload: Partial<IProject>) => {
  const updated = await ProjectModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    throw new AppError('Project not found', StatusCodes.NOT_FOUND);
  }

  return updated;
};

const deleteProject = async (id: string) => {
  const deleted = await ProjectModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  ).lean();

  if (!deleted) {
    throw new AppError('Project not found', StatusCodes.NOT_FOUND);
  }

  return deleted;
};

const restoreProject = async (id: string) => {
  const restored = await ProjectModel.findByIdAndUpdate(
    id,
    { isDeleted: false },
    { new: true }
  ).lean();

  if (!restored) {
    throw new AppError('Project not found', StatusCodes.NOT_FOUND);
  }

  return restored;
};

const permanentDeleteProject = async (id: string) => {
  const deleted = await ProjectModel.findByIdAndDelete(id).lean();

  if (!deleted) {
    throw new AppError('Project not found', StatusCodes.NOT_FOUND);
  }

  return deleted;
};

export const projectService = {
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
