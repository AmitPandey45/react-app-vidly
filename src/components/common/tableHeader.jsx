import React, { Component } from "react";

class TableHeader extends Component {
  raiseSort = (column) => {
    if (!column.content) {
      const sortColumn = { ...this.props.sortColumn };
      if (sortColumn.path === column.path) {
        sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
      } else {
        sortColumn.path = column.path;
        sortColumn.order = "asc";
      }
      this.props.onSort(sortColumn);
    }
  };

  renderSortIcon = (column) => {
    const { sortColumn } = this.props;
    if (sortColumn.path !== column.path || column.content) return null;
    if (sortColumn.order === "asc") return <i className="fa fa-sort-asc"></i>;
    return <i className="fa fa-sort-desc"></i>;
  };

  render() {
    const { columns } = this.props;
    return (
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.path || column.key}
              className={column.content ? "" : "clickable"}
              onClick={() => this.raiseSort(column)}
            >
              {column.label}
              {this.renderSortIcon(column)}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
