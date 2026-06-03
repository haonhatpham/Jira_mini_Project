import { useRef } from "react";
import {
  useWatch,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { PRODUCT_FORM_RULES } from "../../../configs/productForm.config";
import { UI_COUNTS } from "../../../configs/ui.config";
import type {
  CategoryOption,
  ProductFormFieldName,
  ProductFormValues,
  TagOption,
} from "../../../types";
import FormField from "./FormField";

interface ProductFormFieldsProps {
  categories: CategoryOption[];
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  showFieldError: (name: ProductFormFieldName) => string | undefined;
  tags: TagOption[];
}

export default function ProductFormFields({
  categories,
  control,
  register,
  setValue,
  showFieldError,
  tags,
}: ProductFormFieldsProps) {
  const tagDropdownRef = useRef<HTMLDetailsElement>(null);
  const selectedTags = useWatch({
    control,
    name: "tags",
  }) ?? [];

  const handleTagToggle = (tagName: string, checked: boolean): void => {
    const nextTags = checked
      ? Array.from(new Set([...selectedTags, tagName]))
      : selectedTags.filter((selectedTag) => selectedTag !== tagName);

    setValue("tags", nextTags, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    tagDropdownRef.current?.removeAttribute("open");
  };

  return (
    <>
      <FormField id="name" label="Name" required error={showFieldError("name")}>
        <input id="name" type="text" {...register("name")} />
      </FormField>
      <FormField
        id="desc"
        label="Description"
        required
        error={showFieldError("desc")}
      >
        <textarea
          id="desc"
          rows={PRODUCT_FORM_RULES.DESCRIPTION_ROWS}
          {...register("desc")}
        />
      </FormField>
      <FormField
        id="price"
        label="Price"
        required
        error={showFieldError("price")}
      >
        <input
          id="price"
          type="number"
          step={PRODUCT_FORM_RULES.PRICE_STEP}
          min={PRODUCT_FORM_RULES.PRICE_MIN}
          {...register("price")}
        />
      </FormField>
      <FormField
        id="category"
        label="Category"
        required
        error={showFieldError("category")}
      >
        <select id="category" {...register("category")}>
          <option value="" disabled>
            Select category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField id="tags" label="Tags" hint="Select one or more existing tags">
        <details className="tag-dropdown" ref={tagDropdownRef}>
          <summary>
            {selectedTags.length > UI_COUNTS.EMPTY ? (
              <span className="tag-summary-chips" aria-label="Selected tags">
                {selectedTags.map((tag) => (
                  <span className="tag-chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </span>
            ) : (
              <span className="tag-summary-placeholder">Select tags</span>
            )}
          </summary>
          <div className="tag-options">
            {tags.length === UI_COUNTS.EMPTY && (
              <p className="empty-options">No tags available yet.</p>
            )}
            {tags.map((tag) => (
              <label className="tag-checkbox" key={tag.id}>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.name)}
                  onChange={(event) =>
                    handleTagToggle(tag.name, event.target.checked)
                  }
                  value={tag.name}
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </details>
      </FormField>
      <FormField
        id="imageUrl"
        label="Image URL"
        error={showFieldError("imageUrl")}
      >
        <input
          id="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          {...register("imageUrl")}
        />
      </FormField>
    </>
  );
}
