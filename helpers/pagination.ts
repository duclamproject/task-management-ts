interface ObjectPanigation {
  currentPage: number;
  limitItems: number;
  skip?: number;
  totalPages?: number;
}

const paginationHelper = (
  objectPagination: ObjectPanigation,
  query: Record<string, any>,
  countRecords: number
): ObjectPanigation => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  if (query.limit) {
    objectPagination.limitItems = parseInt(query.limit);
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const totalPages = Math.ceil(countRecords / objectPagination.limitItems);
  objectPagination.totalPages = totalPages;
  return objectPagination;
};

export default paginationHelper;
