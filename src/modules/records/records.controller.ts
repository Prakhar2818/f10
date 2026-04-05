import { FastifyReply, FastifyRequest } from "fastify";
import {
  createRecordSchema,
  getRecordsQuerySchema,
  recordIdParamsSchema,
  updateRecordSchema,
} from "./records.schema";
import { recordsService } from "./records.service";
import { successResponse } from "../../utils/response";

export const recordsController = {
  // CREATE RECORD
  createRecord: async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createRecordSchema.parse(request.body);
    const userId = request.user!.userId;

    const record = await recordsService.createRecord(body, userId);

    return reply
      .status(201)
      .send(successResponse("Financial record created successfully", record));
  },

  // GET ALL RECORDS
  getAllRecords: async (request: FastifyRequest, reply: FastifyReply) => {
    const query = getRecordsQuerySchema.parse(request.query);

    const result = await recordsService.getAllRecords(query);

    return reply
      .status(200)
      .send(successResponse("Financial records fetched successfully", result));
  },

  // GET RECORD BY ID
  getRecordById: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = recordIdParamsSchema.parse(request.params);

    const record = await recordsService.getRecordById(id);

    return reply
      .status(200)
      .send(successResponse("Financial record fetched successfully", record));
  },

  // UPDATE RECORD
  updateRecord: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = recordIdParamsSchema.parse(request.params);
    const body = updateRecordSchema.parse(request.body);

    const updatedRecord = await recordsService.updateRecord(id, body);

    return reply
      .status(200)
      .send(successResponse("Financial record updated successfully", updatedRecord));
  },

  // DELETE RECORD
  deleteRecord: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = recordIdParamsSchema.parse(request.params);

    await recordsService.deleteRecord(id);

    return reply
      .status(200)
      .send(successResponse("Financial record deleted successfully"));
  },
};
