import React, { useState } from "react";
import DataTable from "react-data-table-component";

const Datatable = ({ columns, data, title }) => {
  const [filterText, setFilterText] = useState("");

  const filteredData = data?.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  return (
    <div className="p-4">
      {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}

      <div className="mb-3">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded p-2 w-64"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          paginationPerPage={10}
          highlightOnHover
          striped
          fixedHeader
          responsive
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
          }}
        />
      </div>
    </div>
  );
};

export default Datatable;
