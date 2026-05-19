import { useState } from "react";
import { useForm } from "react-hook-form";
import { PRODUCT_FORM_DEFAULT_VALUES } from "../../../configs/productForm.config";
import FormMessages from "./FormMessages.jsx";
import ProductFormFields from "./ProductFormFields.jsx";
import "./ProductForm.css";

export default function ProductForm({ onSubmit }) {
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, touchedFields, isSubmitted },
  } = useForm({
    defaultValues: PRODUCT_FORM_DEFAULT_VALUES,
    mode: "onTouched",
  });

  const showFieldError = (name) =>
    (touchedFields[name] || isSubmitted) && errors[name]?.message;

  const errorEntries = Object.entries(errors);
  const showSummary = isSubmitted && errorEntries.length > 0;

  const onValidSubmit = async (data) => {
    setSubmitError(null);
    setSuccessMessage(null);
    try {
      await onSubmit(data);
      setSuccessMessage("Product created successfully!");
      reset(PRODUCT_FORM_DEFAULT_VALUES);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit(onValidSubmit)}
      noValidate
    >
      <FormMessages
        errorEntries={errorEntries}
        showSummary={showSummary}
        successMessage={successMessage}
        submitError={submitError}
      />

      <fieldset className="form-fields" disabled={isSubmitting}>
        <ProductFormFields
          register={register}
          showFieldError={showFieldError}
        />
      </fieldset>

      <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Create Product"}
      </button>

      {isSubmitting && (
        <p className="form-loading-hint">Please wait, do not submit again.</p>
      )}
    </form>
  );
}
