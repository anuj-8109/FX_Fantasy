import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "react-select";

const renderField = (field) => {
  const baseInputClasses = "w-full rounded-lg  placeholder-gray-400 border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400";

  switch (field.type) {
    case "textarea":
      return (
        <Field
          as="textarea"
          name={field.name}
          placeholder={field.placeholder || `Enter ${field.label}`}
          className={`${baseInputClasses} min-h-[100px] resize-vertical`}
          rows={field.rows || 4}
          {...field.fieldProps}
        />
      );

    case "select":
      return (
        <Field name={field.name}>
          {({ field: formikField, form }) => (
            <select
              {...formikField}
              className={baseInputClasses}
              onChange={(e) => {
                form.setFieldValue(field.name, e.target.value);
                if (field.onChange) {
                  field.onChange(e, form.setFieldValue);
                }
              }}
              disabled={field.disabled}
              {...field.fieldProps}
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
              placeholder={field.placeholder || `Select ${field.label}`}
              value={field.options.filter((option) =>
                Array.isArray(value) ? value.includes(option.value) : false
              )}
              onChange={(selectedOptions) =>
                form.setFieldValue(
                  field.name,
                  selectedOptions ? selectedOptions.map((option) => option.value) : []
                )
              }
              onBlur={() => form.setFieldTouched(field.name, true)}
              isDisabled={field.disabled}
              {...field.fieldProps}
            />
          )}
        </Field>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Field
                type="radio"
                name={field.name}
                value={option.value}
                id={`${field.name}-${option.value}`}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                disabled={field.disabled}
                {...field.fieldProps}
              />
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor={`${field.name}-${option.value}`}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Field
            type="checkbox"
            name={field.name}
            id={field.name}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={field.disabled}
            {...field.fieldProps}
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
          placeholder={field.placeholder || `Enter ${field.label}`}
          className={baseInputClasses}
          disabled={field.disabled}
          autoComplete={field.autoComplete || "email"}
          {...field.fieldProps}
        />
      );

    case "password":
      return (
        <Field
          type="password"
          name={field.name}
          placeholder={field.placeholder || `Enter ${field.label}`}
          id={field.name}
          autoComplete={field.autoComplete || "current-password"}
          className={baseInputClasses}
          disabled={field.disabled}
          {...field.fieldProps}
        />
      );

    case "file":
      return (
        <Field name={field.name}>
          {({ form }) => (
            <input
              type="file"
              name={field.name}
              multiple={field.multiple || false}
              accept={field.accept}
              className={`${baseInputClasses} file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100`}
              onChange={(event) => {
                const files = event.currentTarget.files;
                form.setFieldValue(field.name, field.multiple ? files : files[0]);
                if (field.onChange) {
                  field.onChange(event, form.setFieldValue);
                }
              }}
              disabled={field.disabled}
              {...field.fieldProps}
            />
          )}
        </Field>
      );

    case "number":
      return (
        <Field
          type="number"
          name={field.name}
          placeholder={field.placeholder || `Enter ${field.label}`}
          className={baseInputClasses}
          min={field.min}
          max={field.max}
          step={field.step}
          disabled={field.disabled}
          autoComplete={field.autoComplete}
          {...field.fieldProps}
        />
      );

    case "date":
      return (
        <Field
          type="date"
          name={field.name}
          className={baseInputClasses}
          min={field.min}
          max={field.max}
          disabled={field.disabled}
          {...field.fieldProps}
        />
      );

    default:
      return (
        <Field
          type={field.type || "text"}
          name={field.name}
          placeholder={field.placeholder || `Enter ${field.label}`}
          autoComplete={field.autoComplete}
          className={baseInputClasses}
          disabled={field.disabled}
          {...field.fieldProps}
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
  enableReinitialize = false,
  submitButtonProps = {},
  formClassName = "",
  loading = false,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize={enableReinitialize}
    >
      {({ handleSubmit, validateForm, setTouched, isSubmitting, errors, touched }) => (
        <Form
          className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 ${formClassName}`}
          encType="multipart/form-data"
          onSubmit={async (e) => {
            e.preventDefault();
            const formErrors = await validateForm();

            if (Object.keys(formErrors).length > 0) {
              const touchedFields = {};
              Object.keys(formErrors).forEach((key) => {
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
                    className={`text-sm font-medium text-gray-700 ${field.required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""
                      }`}
                  >
                    {field.label}
                  </label>
                )}

                <div className={`relative ${errors[field.name] && touched[field.name] ? "border-red-300" : ""}`}>
                  {renderField(field)}
                </div>

                <ErrorMessage
                  name={field.name}
                  component="div"
                  className="text-red-500 text-xs mt-1 font-medium"
                />

                {field.helpText && (
                  <div className="text-gray-500 text-xs mt-1">
                    {field.helpText}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="col-span-4">
            <button
              type="submit"
              disabled={loading || isSubmitting || submitButtonProps.disabled}
              className={`w-full px-4 py-3 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${submitButtonProps.className || ""}`}
              {...submitButtonProps}
            >
              {loading || isSubmitting
                ? (submitButtonProps.loadingText || "Processing...")
                : (SubmitBtn || submitButtonProps.label || "Submit")}
            </button>
          </div>
        </Form>

      )}
    </Formik>
  );
};

export default ReusableForm;