import { recordsRepository } from "./records.repository";
import { AppError } from "../../utils/appError";
import {
  CreateRecordInput,
  RecordFilters,
  UpdateRecordInput,
} from "./records.types";

export const recordsService = {
  // CREATE
  createRecord: async (data: CreateRecordInput, createdById: string) => {
    return recordsRepository.create(data, createdById);
  },

  // GET ALL
  getAllRecords: async (filters: RecordFilters) => {
    return recordsRepository.findAll(filters);
  },

  // GET BY ID
  getRecordById: async (id: string) => {
    const record = await recordsRepository.findById(id);

    if (!record) {
      throw new AppError("Record not found", 404);
    }

    return record;
  },

  // UPDATE
  updateRecord: async (id: string, data: UpdateRecordInput) => {
    const existingRecord = await recordsRepository.findById(id);

    if (!existingRecord) {
      throw new AppError("Record not found", 404);
    }

    return recordsRepository.update(id, data);
  },

  // DELETE
  deleteRecord: async (id: string) => {
    const existingRecord = await recordsRepository.findById(id);

    if (!existingRecord) {
      throw new AppError("Record not found", 404);
    }

    return recordsRepository.softDelete(id);
  },
};
