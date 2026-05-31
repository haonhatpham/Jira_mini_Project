import type { UseFormRegister } from "react-hook-form";
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
  register: UseFormRegister<ProductFormValues>;
  showFieldError: (name: ProductFormFieldName) => string | undefined;
  tags: TagOption[];
}

export default function ProductFormFields({
  categories,
  register,
  showFieldError,
  tags,
}: ProductFormFieldsProps) {
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
        <details className="tag-dropdown">
          <summary>Select tags</summary>
          <div className="tag-options">
            {tags.length === UI_COUNTS.EMPTY && (
              <p className="empty-options">No tags available yet.</p>
            )}
            {tags.map((tag) => (
              <label className="tag-checkbox" key={tag.id}>
                <input type="checkbox" value={tag.name} {...register("tags")} />
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
