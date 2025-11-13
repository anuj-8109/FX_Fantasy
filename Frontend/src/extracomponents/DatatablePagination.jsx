import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import DataTable from "react-data-table-component";
import { Search, RefreshCw, Download, FileText, X } from "lucide-react";
import { debounce } from "lodash";
// import { useCallback } from "react";
const Datatable = ({
  columns,
  data = [],
  totalRows = 0,
  currentPage = 1,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onRefresh,
  title,
  showExport = true,
  showRefresh = true,
  theme = "light",
  filterText: parentFilterText = "",
  onFilterChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localFilterText, setLocalFilterText] = useState(parentFilterText);
  
  // Ref to track if component is mounted
  const isInitialMount = useRef(true);
  const debounceTimer = useRef(null);
  const inputRef = useRef(null);

  // Sync with parent filter text only if different
  useEffect(() => {
    if (parentFilterText !== localFilterText) {
      setLocalFilterText(parentFilterText);
    }
  }, [parentFilterText]);

  // Debounce effect for filter text with API call control
  useEffect(() => {
    // Skip the initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      // Only call onFilterChange if filter text changed
      if (onFilterChange) {
        onFilterChange(localFilterText);
      }
    }, 600);

    // Cleanup function
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [localFilterText]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsLoading(true);
      await onRefresh();
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    let exportData = data;

    if (typeof fetchAllData === "function") {
      exportData = await fetchAllData(localFilterText);
    }

    const exportableColumns = columns.filter((col) => col.export !== false);

    const csvContent = [
      ["S.No", ...exportableColumns.map((col) => col.name)].join(","),
      ...exportData.map((row, index) => {
        const serialNumber = index + 1;
        const rowValues = exportableColumns.map((col) => {
          let value = col.selector ? col.selector(row) : row[col.id] || "";
          if (col.name.toLowerCase().includes("phone")) value = `\t${String(value)}`;
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        return [serialNumber, ...rowValues].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "data"}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleClearFilter = useCallback(() => {
    setLocalFilterText("");
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (onFilterChange) {
      onFilterChange("");
    }
    // Keep focus on input after clearing
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }, [onFilterChange]);

  const handleFilterChange = useCallback((e) => {
    setLocalFilterText(e.target.value);
  }, []);

  const paginationComponentOptions = useMemo(() => ({
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  }), []);

  const enhancedColumns = useMemo(() => [
    {
      name: "S.No",
      selector: (row, i) => (currentPage - 1) * rowsPerPage + i + 1,
      width: "70px",
    },
    ...columns,
  ], [columns, currentPage, rowsPerPage]);

  return (
    <div className="w-full space-y-0 custom-datatable Search_btn">
      {/* Search and action buttons */}
      <div className="relative flex justify-between px-1 py-2 border-b Search_btn">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search across all columns..."
            className="block w-full pl-10 pr-10 py-2.5 rounded-lg text-sm transition-all duration-200 border focus:outline-none"
            value={localFilterText}
            onChange={handleFilterChange}
          />
          {localFilterText && (
            <button
              type="button"
              onClick={handleClearFilter}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center h-6 w-6 rounded-full border border-gray-400 bg-white hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {showRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-2 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          )}
          {showExport && (
            <button
              onClick={handleExport}
              className={`inline-flex items-center gap-2 px-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } shadow-sm hover:shadow-md`}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={enhancedColumns}
        data={data}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={[2, 5, 10, 15, 20, 25, 50]}
        onChangePage={onPageChange}
        onChangeRowsPerPage={onRowsPerPageChange}
        paginationDefaultPage={currentPage}
        
        highlightOnHover
        fixedHeader
        fixedHeaderScrollHeight="1000px"
        responsive
        paginationComponentOptions={paginationComponentOptions}
        // progressPending={isLoading}
        // progressComponent={
        //   <div className="flex flex-col items-center justify-center py-16 space-y-4">
        //     <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        //     <p className="text-sm">Loading data...</p>
        //   </div>
        // }
        noDataComponent={
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <FileText className="w-12 h-12" />
            <p className="text-lg font-medium">No data available</p>
          </div>
        }
      />
    </div>
  );
};

export default Datatable;