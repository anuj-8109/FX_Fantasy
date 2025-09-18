import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Search, Filter, Download, RefreshCw, FileText, X } from "lucide-react";


const Datatable = ({
  columns,
  data,
  title,
  subtitle,
  showExport = true,
  showRefresh = true,
  onRefresh,
  customStyles = {},
  theme = "light"
}) => {
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const filteredData = data?.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );



  const handleRefresh = async () => {
  if (onRefresh) {
    setIsLoading(true);
    await onRefresh();   
    setIsLoading(false);
  }
};


  const handleExport = () => {
    const csvContent = [
      columns.map(col => col.name).join(','),
      ...filteredData.map(row =>
        columns.map(col => {
          const value = col.selector ? col.selector(row) : row[col.id] || '';
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'data'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  
  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
  };

  return (
    <div className="w-full space-y-0 custom-datatable Search_btn">
     

      <div className={`relative flex justify-between  px-1 py-2 border-b Search_btn `}>
        <div className="relative max-w-md ">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
            <Search className={`h-4 w-4 `} />
          </div>
          <input
            type="text"
            placeholder="Search across all columns..."
            className={`block w-full pl-10 Search_btn searchBd pr-4 py-2.5 rounded-lg text-sm transition-all duration-200  focus:outline-none border`}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          {filterText && (
            <button
              type="button"
              onClick={() => setFilterText("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}

        </div>
        <div className="flex items-center gap-4  ">
          {showRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-2 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}


          {showExport && (
            <button
              onClick={handleExport}
              className={`inline-flex items-center gap-2 px-2 py-2.5  rounded-lg text-sm font-medium transition-all duration-200 ${theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
                } shadow-sm hover:shadow-md`}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>
      </div>


      <div key={refreshKey}>
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
          highlightOnHover
          striped={false}
          fixedHeader
          fixedHeaderScrollHeight="1000px"
          responsive
          onRefresh={() => setRefreshKey(prev => prev + 1)}
          paginationComponentOptions={paginationComponentOptions}
          progressPending={isLoading}
          progressComponent={
            <div className="flex flex-col items-center justify-center py-16 space-y-4 Search_btn">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <p className={`text-sm `}>
                Loading data...
              </p>
            </div>
          }
          noDataComponent={

            <div className="flex flex-col items-center justify-center py-16 space-y-4 Search_btn">
              <FileText className={`w-12 h-12 `} />
              <p className={`text-lg font-medium `}>
                No data available
              </p>
            </div>
          }
        />
      </div>
    </div>

  );
};

export default Datatable;