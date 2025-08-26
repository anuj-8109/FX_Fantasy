import React from "react";
import { Link } from "react-router-dom";

const Content = ({
  Page_title,
  button_title,
  Page_title_showClient,
  button_status,
  show_csv_button,
  show_Stat_End_date,
  showEdit,
  csv_title,
  csv_data,
  route,
  OpenModal,
  ...rest
}) => {
  return (
    <div className="flex-1 p-6 min-h-screen ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            {button_status !== false && button_title === "Back" && (
              <Link
                to={route}
                className="text-blue-600 hover:text-blue-500 flex items-center gap-2 font-medium"
              >
                <i className="fa-solid fa-arrow-left-long text-lg"></i>
                Back
              </Link>
            )}
            <h3 className="text-2xl font-bold ">{Page_title}</h3>
          </div>
          {Page_title_showClient && (
            <h6 className="text-sm  mt-1">{Page_title_showClient}</h6>
          )}
        </div>

        {button_status !== false && button_title !== "Back" && (
          <Link
            to={route}
            className=" px-4 py-2 rounded-lg shadow hover:bg-blue-500 transition flex items-center gap-2 text-sm font-medium"
          >
            <i className="fa-solid fa-plus"></i>
            {button_title}
          </Link>
        )}
      </div>

      {/* Main Card */}
 <div className="rounded-xl shadow-lg p-6 space-y-4 border border-gray-100 hover:shadow-2xl transition duration-300">
  {/* Card Header (Optional) */}
  {rest.cardTitle && (
    <h4 className="text-lg font-semibold text-gray-900">{rest.cardTitle}</h4>
  )}

  {/* Form / Child Content */}
  <div className="form-validation">{rest.children}</div>
</div>

    </div>
  );
};

export default Content;
