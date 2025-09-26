import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Content = ({
  Page_title,
  button_title,
  Page_title_showClient,
  button_status,
  route,
  extra_button,          
  extra_button_action,   
  ...rest
}) => {
  return (
    <div className="flex-1 p-4 min-h-screen ">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border p-2 rounded-md Content_Style">
        <div className="flex flex-col ">
          <div className="flex items-center gap-2 Content-Style ">
            {button_status !== false && button_title === "Back" && (
              <Link
                to={route}
                className="text-white-900 hover:text-white-500 flex items-center gap-2 font-medium"
              >
                <ArrowLeft className="w-6 h-6 " />
              </Link>
            )}

            <h3 className="text-lg font-bold">{Page_title}</h3>
          </div>

          {Page_title_showClient && (
            <h6 className="text-sm mt-1">{Page_title_showClient}</h6>
          )}
        </div>

        <div className="flex gap-2">
        
          {button_status !== false && button_title !== "Back" && (
            <Link
              to={route}
              className="px-3 py-1 border rounded-lg shadow hover:bg-blue-500 transition flex items-center gap-2 text-sm font-medium"
            >
              {button_title}
            </Link>
          )}

         
          {extra_button && (
            typeof extra_button_action === "function" ? (
              <button
                onClick={extra_button_action}
                 className="px-3 py-1 border rounded-lg shadow hover:bg-green-500 transition flex items-center gap-2 text-sm font-medium"
              >
                {extra_button}
              </button>
            ) : (
              <Link
                to={extra_button_action || "#"}
                className="px-3 py-1 border rounded-lg shadow hover:bg-green-500 transition flex items-center gap-2 text-sm font-medium"
              >
                {extra_button}
              </Link>
            )
          )}
        </div>
      </div>

      
      <div className="rounded-xl space-y-4 border transition duration-300">
        {rest.cardTitle && (
          <h4 className="text-lg font-semibold text-gray-900">
            {rest.cardTitle}
          </h4>
        )}

        <div className="form-validation">{rest.children}</div>
      </div>
    </div>
  );
};

export default Content;
