
import React from "react";
import { useTheme } from "../context/ThemeProvider";

const TableComponent = ({ headers, data }) => {
  const { isDarkTheme } = useTheme();
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            {headers.map((header, index) => (
              <th key={index} className="py-3 px-2 md:px-6 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="text-gray-600 text-sm font-light">
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-3 px-6 text-center text-lg font-semibold">
                No Data Fetched
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                {headers.map((header, index) => (
                  <td key={index} className="py-3 px-2 md:px-6 text-center text-md font-semibold">
                    {item[header.toLowerCase()]} 
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
