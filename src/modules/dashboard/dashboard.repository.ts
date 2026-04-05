import { RecordStatus, RecordType } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const dashboardRepository = {
  // SUMMARY
  getSummary: async () => {
    const [incomeAgg, expenseAgg, totalRecords] = await Promise.all([
      prisma.financialRecord.aggregate({
        where: {
          status: RecordStatus.ACTIVE,
          type: RecordType.INCOME,
        },
        _sum: {
          amount: true,
        },
      }),

      prisma.financialRecord.aggregate({
        where: {
          status: RecordStatus.ACTIVE,
          type: RecordType.EXPENSE,
        },
        _sum: {
          amount: true,
        },
      }),

      prisma.financialRecord.count({
        where: {
          status: RecordStatus.ACTIVE,
        },
      }),
    ]);

    const totalIncome = Number(incomeAgg._sum.amount || 0);
    const totalExpenses = Number(expenseAgg._sum.amount || 0);

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      totalRecords,
    };
  },

  // CATEGORY BREAKDOWN
  getCategoryBreakdown: async () => {
    const result = await prisma.financialRecord.groupBy({
      by: ["type", "category"],
      where: {
        status: RecordStatus.ACTIVE,
      },
      _sum: {
        amount: true,
      },
      orderBy: [{ type: "asc" }, { category: "asc" }],
    });

    return result.map((item: (typeof result)[number]) => ({
      type: item.type,
      category: item.category,
      total: Number(item._sum.amount || 0),
    }));
  },

  // RECENT ACTIVITY
  getRecentActivity: async (limit = 5) => {
    return prisma.financialRecord.findMany({
      where: {
        status: RecordStatus.ACTIVE,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  },

  // MONTHLY TRENDS
  getMonthlyTrends: async (year?: number) => {
    const selectedYear = year || new Date().getFullYear();

    const startDate = new Date(selectedYear, 0, 1); // Jan 1
    const endDate = new Date(selectedYear, 11, 31, 23, 59, 59, 999); // Dec 31

    const records = await prisma.financialRecord.findMany({
      where: {
        status: RecordStatus.ACTIVE,
        recordDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        type: true,
        amount: true,
        recordDate: true,
      },
      orderBy: {
        recordDate: "asc",
      },
    });

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthMap: Record<
      string,
      {
        month: string;
        income: number;
        expense: number;
      }
    > = {};

    // Initialize all 12 months so frontend graph always gets full data
    monthNames.forEach((month) => {
      monthMap[month] = {
        month,
        income: 0,
        expense: 0,
      };
    });

    records.forEach((record: (typeof records)[number]) => {
      const monthIndex = new Date(record.recordDate).getMonth();
      const month = monthNames[monthIndex];

      if (record.type === RecordType.INCOME) {
        monthMap[month].income += Number(record.amount);
      } else {
        monthMap[month].expense += Number(record.amount);
      }
    });

    return monthNames.map((month) => monthMap[month]);
  },
};
