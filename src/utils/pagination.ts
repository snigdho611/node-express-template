const getPagination = (page: number, itemPerPage: number) => {
  return { skip: (page - 1) * itemPerPage, limit: itemPerPage };
};

export default getPagination;
