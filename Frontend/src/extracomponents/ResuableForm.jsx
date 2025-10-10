import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const renderField = (field, form, values) => {
  const baseInputClasses =
    "w-full rounded-lg placeholder-gray-400 border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400";

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
                  selectedOptions
                    ? selectedOptions.map((option) => option.value)
                    : []
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
                form.setFieldValue(
                  field.name,
                  field.multiple ? files : files[0]
                );
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

    case "ckeditor":
      return (
        <Field name={field.name}>
          {({ field: formikField, form }) => (
            <CKEditor
              editor={ClassicEditor}
              data={formikField.value}
              onChange={(event, editor) => {
                const data = editor.getData();
                form.setFieldValue(field.name, data);
              }}
              onBlur={() => form.setFieldTouched(field.name, true)}
              {...field.fieldProps}
            />
          )}
        </Field>
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

    case "prizeDistribution":
      return (
        <FieldArray name={field.name}>
          {({ push, remove }) => (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">🏆 Prize Distribution</h3>
                <button
                  type="button"
                  onClick={() => push({ from: "", to: "", amount: "" })}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  + Add Row
                </button>
              </div>

              {values[field.name]?.map((prize, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded-md">
                  <div className="flex-1">
                    <Field
                      type="number"
                      name={`${field.name}.${idx}.from`}
                      placeholder="From Rank"
                      min="1"
                      className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <ErrorMessage
                      name={`${field.name}.${idx}.from`}
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  <div className="flex-1">
                    <Field
                      type="number"
                      name={`${field.name}.${idx}.to`}
                      placeholder="To Rank"
                      min="1"
                      className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <ErrorMessage
                      name={`${field.name}.${idx}.to`}
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  <div className="flex-1">
                    <Field
                      type="number"
                      name={`${field.name}.${idx}.amount`}
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                      className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <ErrorMessage
                      name={`${field.name}.${idx}.amount`}
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  {values[field.name].length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-red-600 hover:text-red-800 font-bold text-lg px-2"
                      title="Remove row"
                    >
                      ✖
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </FieldArray>
      );

    case "custom":
      return (
        <Field name={field.name}>
          {({ form, field: formikField }) =>
            field.render
              ? field.render(field, form, form.values, form.setFieldValue)
              : null
          }
        </Field>
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
      {({
        handleSubmit,
        validateForm,
        setTouched,
        isSubmitting,
        errors,
        touched,
        values,
      }) => (
        <Form
          className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 Form_style ${formClassName}`}
          encType="multipart/form-data"
          onSubmit={async (e) => {
            e.preventDefault();
            const formErrors = errors;
            if (Object.keys(formErrors).length > 0) {
              const firstErrorKey = Object.keys(formErrors)[0];
              if (firstErrorKey) {
                const errorElement = document.querySelector(
                  `[name="${firstErrorKey}"]`
                );
                if (errorElement) {
                  errorElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  errorElement.focus();
                }
              }
            }

            handleSubmit(e);
          }}
        >
          {fields.map((field) => (
            <div key={field.name} className={field.colClass || "col-span-2"}>
              <div className="flex flex-col space-y-1">
                {field.type !== "checkbox" && 
                 field.type !== "radio" && 
                 field.type !== "prizeDistribution" && (
                  <label
                    htmlFor={field.name}
                    className={`text-sm font-medium ${
                      field.required
                        ? "after:content-['*'] after:text-red-500 after:ml-1"
                        : ""
                    }`}
                  >
                    {field.label}
                  </label>
                )}

                <div
                  className={`relative ${
                    errors[field.name] && touched[field.name]
                      ? "border-red-300"
                      : ""
                  }`}
                >
                  {renderField(field, null, values)}
                </div>

                {field.type !== "prizeDistribution" && (
                  <ErrorMessage
                    name={field.name}
                    component="div"
                    className="text-xs mt-1 font-medium text-red-500"
                  />
                )}

                {field.helpText && (
                  <div className="text-xs mt-1">{field.helpText}</div>
                )}
              </div>
            </div>
          ))}

          <div className="col-span-4">
            <button
              type="submit"
              disabled={loading || isSubmitting || submitButtonProps.disabled}
              className={`px-4 py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                submitButtonProps.className || ""
              }`}
              {...submitButtonProps}
            >
              {loading || isSubmitting
                ? submitButtonProps.loadingText || "Processing..."
                : SubmitBtn || submitButtonProps.label || "Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ReusableForm;