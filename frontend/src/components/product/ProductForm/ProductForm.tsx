import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { PRODUCT_FORM_DEFAULT_VALUES } from "../../../configs/productForm.config";
import { UI_COUNTS } from "../../../configs/ui.config";
import { useAsyncAction } from "../../../hooks/useAsyncAction";
import { useProductOptions } from "../../../hooks/useProductOptions";
import { productFormSchema } from "../../../schemas/productForm.schema";
import type { ProductFormFieldName, ProductFormValues } from "../../../types";
import FormMessages, { type FormErrorEntry } from "./FormMessages";
import ProductFormFields from "./ProductFormFields";
import "./ProductForm.css";

interface ProductFormProps {
  initialValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  resetOnSuccess?: boolean;
  submitLabel?: string;
  successMessageText?: string;
}

export default function ProductForm({
  initialValues = PRODUCT_FORM_DEFAULT_VALUES,
  onSubmit,
  resetOnSuccess = true,
  submitLabel = "Create Product",
  successMessageText = "Product saved successfully!",
}: ProductFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    error: submitError,
    execute: submitForm,
    isLoading: isSaving,
    reset: resetSubmitState,
  } = useAsyncAction<[ProductFormValues], void>(onSubmit);
  const {
    categories,
    error: optionsError,
    status: optionsStatus,
    tags,
  } = useProductOptions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, touchedFields, isSubmitted },
  } = useForm<ProductFormValues>({
    defaultValues: initialValues,
    mode: "onTouched",
    resolver: zodResolver(productFormSchema),
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const showFieldError = (name: ProductFormFieldName): string | undefined => {
    const message = errors[name]?.message;
    if (!(touchedFields[name] || isSubmitted) || typeof message !== "string") {
      return undefined;
    }

    return message;
  };

  const errorEntries = getFormErrorEntries(errors);
  const showSummary = isSubmitted && errorEntries.length > UI_COUNTS.EMPTY;

  const onValidSubmit = async (data: ProductFormValues): Promise<void> => {
    setSuccessMessage(null);
    resetSubmitState();

    try {
      await submitForm(data);
      setSuccessMessage(successMessageText);
      if (resetOnSuccess) {
        reset(PRODUCT_FORM_DEFAULT_VALUES);
      }
    } catch {
      // useAsyncAction owns the visible submit error state.
    }
  };
  const disableForm = isSubmitting || isSaving || optionsStatus === "loading";

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
        submitError={submitError || optionsError}
      />

      <fieldset className="form-fields" disabled={disableForm}>
        <ProductFormFields
          categories={categories}
          register={register}
          showFieldError={showFieldError}
          tags={tags}
        />
      </fieldset>

      <button
        type="submit"
        className="form-submit-btn"
        disabled={isSubmitting || isSaving || optionsStatus !== "data"}
      >
        {isSubmitting || isSaving
          ? "Saving..."
          : optionsStatus === "loading"
            ? "Loading options..."
            : submitLabel}
      </button>

      {(isSubmitting || isSaving) && (
        <p className="form-loading-hint">Please wait, do not submit again.</p>
      )}
    </form>
  );
}

function getFormErrorEntries(
  errors: FieldErrors<ProductFormValues>,
): FormErrorEntry[] {
  return Object.entries(errors).flatMap(([key, error]) => {
    if (!error || typeof error.message !== "string") {
      return [];
    }

    return [[key, error.message]];
  });
}
