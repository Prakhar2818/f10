export const getPagination = (page = 1, limit = 10) => {
  const currentPage = Number(page);
  const currentLimit = Number(limit);

  return {
    skip: (currentPage - 1) * currentLimit,
    take: currentLimit,
    page: currentPage,
    limit: currentLimit,
  };
};