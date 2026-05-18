import { useState } from "react";
import { useForm } from "react-hook-form";
import { PRODUCT_CATEGORIES } from "../../../configs/product.config";
import "./ProductForm.css";

const defaultValues = {
  name: "",
  desc: "",
  price: "",
  category: "",
  tags: "",
  imageUrl: "",
};

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default function ProductForm({ onSubmit }) {
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, touchedFields, isSubmitted },
  } = useForm({
    defaultValues,
    mode: "onTouched",
  });

  const showFieldError = (name) =>
    (touchedFields[name] || isSubmitted) && errors[name];

  const errorEntries = Object.entries(errors);
  const showSummary = isSubmitted && errorEntries.length > 0;

  const onValidSubmit = async (data) => {
    setSubmitError(null);
    setSuccessMessage(null);
    try {
      await onSubmit(data);
      setSuccessMessage("Product created successfully!");
      reset(defaultValues);
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
      {showSummary && (
        <div className="form-error-summary" role="alert">
          <strong>Please fix {errorEntries.length} error(s):</strong>
          <ul>
            {errorEntries.map(([key, err]) => (
              <li key={key}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {successMessage && (
        <p className="form-success" role="status">
          {successMessage}
        </p>
      )}

      {submitError && (
        <p className="form-submit-error" role="alert">
          {submitError}
        </p>
      )}

      <fieldset className="form-fields" disabled={isSubmitting}>
        <div className="form-field">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
          />
          {showFieldError("name") && (
            <span className="field-error">{errors.name.message}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="desc">Description *</label>
          <textarea
            id="desc"
            rows={3}
            {...register("desc", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            })}
          />
          {showFieldError("desc") && (
            <span className="field-error">{errors.desc.message}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="price">Price *</label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register("price", {
              required: "Price is required",
              validate: (v) =>
                Number(v) > 0 || "Price must be greater than 0",
            })}
          />
          {showFieldError("price") && (
            <span className="field-error">{errors.price.message}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            {...register("category", { required: "Please select a category" })}
          >
            <option value="" disabled>
              Select category
            </option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {showFieldError("category") && (
            <span className="field-error">{errors.category.message}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            placeholder="e.g. sale, new, phone"
            {...register("tags")}
          />
          <span className="field-hint">Comma-separated (optional)</span>
        </div>

        <div className="form-field">
          <label htmlFor="imageUrl">Image URL *</label>
          <input
            id="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            {...register("imageUrl", {
              required: "Image URL is required",
              validate: (v) =>
                isValidUrl(v.trim()) || "Enter a valid URL (https://...)",
            })}
          />
          {showFieldError("imageUrl") && (
            <span className="field-error">{errors.imageUrl.message}</span>
          )}
        </div>
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
