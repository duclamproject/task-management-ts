"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationHelper = (objectPagination, query, countRecords) => {
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
exports.default = paginationHelper;
