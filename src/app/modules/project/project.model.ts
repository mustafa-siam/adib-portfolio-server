import { Schema, model, Document } from 'mongoose';
import { IProject } from './project.schema';

type IProjectDocument = IProject & { isDeleted?: boolean } & Document;

const keyStatSchema = new Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const processStepSchema = new Schema(
  {
    number: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const testimonialSchema = new Schema(
  {
    quote: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    avatar: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const projectMongoSchema = new Schema<IProjectDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    poster: {
      type: String,
      default: '',
      trim: true,
    },
    videoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    clientBadge: {
      type: String,
      default: '',
      trim: true,
    },
    roleBadge: {
      type: String,
      default: '',
      trim: true,
    },
    liveLink: {
      type: String,
      default: '',
      trim: true,
    },
    overview: {
      heading: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      stats: { type: [keyStatSchema], default: [] },
    },
    process: {
      heading: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      steps: { type: [processStepSchema], default: [] },
      image: { type: String, default: '', trim: true },
    },
    testimonial: {
      type: testimonialSchema,
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectMongoSchema.index({ slug: 1 });
projectMongoSchema.index({ createdAt: -1 });

const ProjectModel = model<IProjectDocument>('Project', projectMongoSchema);

export default ProjectModel;
