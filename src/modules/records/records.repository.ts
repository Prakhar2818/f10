import { Prisma, RecordStatus, RecordType } from "@prisma/client";
import { prisma } from "../../config/prisma";
import {
  CreateRecordInput,
  RecordFilters,
  UpdateRecordInput,
} from "./records.types";

export const recordsRepository = {
  // CREATE RECORD
  create: async (data: CreateRecordInput, createdById: string) => {
    return prisma.financialRecord.create({
      data: {
        amount: data.amount,
        type: data.type,
        category: data.category,
        recordDate: data.recordDate,
        description: data.description,
        createdById,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  },

  // GET ALL RECORDS
  findAll: async (filters: RecordFilters) => {
    const { type, category, startDate, endDate, page, limit, search } = filters;

    const where: Prisma.FinancialRecordWhereInput = {
      status: RecordStatus.ACTIVE,
    };

    // Filter by type
    if (type) {
      where.type = type as RecordType;
    }

    // Filter by category
    if (category) {
      where.category = {
        contains: category,
        mode: "insensitive",
      };
    }

    // Search by category or description
    if (search) {
      where.OR = [
        {
          category: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      where.recordDate = {};
      if (startDate) where.recordDate.gte = startDate;
      if (endDate) where.recordDate.lte = endDate;
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          recordDate: "desc",
        },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      prisma.financialRecord.count({ where }),
    ]);

    return {
      records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // GET RECORD BY ID
  findById: async (id: string) => {
    return prisma.financialRecord.findFirst({
      where: {
        id,
        status: RecordStatus.ACTIVE,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  },

  // UPDATE RECORD
  update: async (id: string, data: UpdateRecordInput) => {
    const updateData: Prisma.FinancialRecordUpdateInput = {};

    if (data.amount !== undefined) {
      updateData.amount = data.amount;
    }

    if (data.type !== undefined) {
      updateData.type = data.type;
    }

    if (data.category !== undefined) {
      updateData.category = data.category;
    }

    if (data.recordDate !== undefined) {
      updateData.recordDate = data.recordDate;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    return prisma.financialRecord.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  },

  // SOFT DELETE
  softDelete: async (id: string) => {
    return prisma.financialRecord.update({
      where: { id },
      data: {
        status: RecordStatus.DELETED,
      },
    });
  },
};
