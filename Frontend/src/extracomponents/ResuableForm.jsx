import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "react-select";

const renderField = (field) => {
  switch (field.type) {
    case "textarea":
      return (
        <Field
          as="textarea"
          name={field.name}
          placeholder={field.placeholder}
          className="w-full rounded-lg bg-white text-gray-700 placeholder-gray-400 border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );

    case "select":
      return (
        <Field name={field.name}>
          {({ field: formikField, form }) => (
            <select
              {...formikField}
              className="w-full rounded-lg bg-white text-gray-700 border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => {
                form.setFieldValue(field.name, e.target.value);
                if (field.onChange) {
                  field.onChange(e, form.setFieldValue);
                }
              }}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>
      );

    case "multiSelect":
      return (
        <Field name={field.name}>
          {({ field: { value }, form }) => (
            <Select
              isMulti
              name={field.name}
              options={field.options}
              className="w-full text-black"
              classNamePrefix="react-select"
              value={field.options.filter((option) =>
                value.includes(option.value)
              )}
              onChange={(selectedOptions) =>
                form.setFieldValue(
                  field.name,
                  selectedOptions.map((option) => option.value)
                )
              }
              onBlur={() => form.setFieldTouched(field.name, true)}
            />
          )}
        </Field>
      );

    case "radio":
      return field.options?.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Field
            type="radio"
            name={field.name}
            value={option.value}
            id={`${field.name}-${option.value}`}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor={`${field.name}-${option.value}`}
          >
            {option.label}
          </label>
        </div>
      ));

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Field
            type="checkbox"
            name={field.name}
            id={field.name}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor={field.name}
          >
            {field.label}
          </label>
        </div>
      );

    case "email":
      return (
        <Field
          type="email"
          name={field.name}
          id={field.name}
          placeholder={field.placeholder}
          className="w-full rounded-lg bg-white text-gray-700 placeholder-gray-400 border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );

    case "password":
      return (
        <Field
          type="password"
          name={field.name}
          placeholder={field.placeholder}
          id={field.name}
          autoComplete={field.autoComplete}
          className="w-full rounded-lg bg-white text-gray-700 placeholder-gray-400 border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );

    case "file":
      return (
        <Field name={field.name}>
          {({ form }) => (
            <input
              type="file"
              name={field.name}
              multiple
              className="w-full rounded-lg bg-white text-gray-700 border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(event) => {
                form.setFieldValue(field.name, event.currentTarget.files);
              }}
            />
          )}
        </Field>
      );

    default:
      return (
        <Field
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          className="w-full rounded-lg bg-white text-gray-700 placeholder-gray-400 border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
  }
};

const ReusableForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  SubmitBtn,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, validateForm, setTouched }) => (
        <Form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          encType="multipart/form-data"
          onSubmit={async (e) => {
            e.preventDefault();
            const errors = await validateForm();

            if (Object.keys(errors).length > 0) {
              const touchedFields = {};
              Object.keys(errors).forEach((key) => {
                touchedFields[key] = true;
              });
              setTouched(touchedFields);

              setTimeout(() => {
                const errorElement = document.querySelector(".text-red-500");
                if (errorElement) {
                  errorElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }, 100);

              return;
            }
            handleSubmit(e);
          }}
        >
          {fields.map((field) => (
            <div key={field.name} className={field.colClass || "col-span-2"}>
              <div className="flex flex-col space-y-1">
                {field.type !== "checkbox" && field.type !== "radio" && (
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                )}
                {renderField(field)}
                <ErrorMessage
                  name={field.name}
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
            </div>
          ))}

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full px-4 py-3 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition"
            >
              {SubmitBtn ? SubmitBtn : "Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ReusableForm;
