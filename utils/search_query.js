const _ = require("lodash");
class SearchQuery {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};

    let { query } = this;
    query = query.find({ ...keyword });

    return this;
  }

  filter() {
    let { query, queryString } = this;
    let filterBy = _.omit({ ...queryString }, ["keyword", "limit", "page"]);
    filterBy = JSON.stringify(filterBy);
    filterBy = filterBy.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    query = query.find(JSON.parse(filterBy));
    return this;
  }

  pagination(fetchData) {
    let { query, queryString } = this;
    const currentPage = Number(queryString.page) || 1;
    const skip = fetchData * (currentPage - 1);

    query = query.limit(fetchData).skip(skip);
    return this;
  }
}

module.exports = SearchQuery;
