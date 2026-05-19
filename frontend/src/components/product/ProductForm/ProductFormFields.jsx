import { PRODUCT_CATEGORIES } from "../../../configs/product.config";
import { PRODUCT_FORM_RULES } from "../../../configs/productForm.config";
import { isValidUrl } from "../../../utils/url.util";
import FormField from "./FormField.jsx";

export default function ProductFormFields({ register, showFieldError }) {
  return (
    <>
      <FormField id="name" label="Name" required error={showFieldError("name")}>
        <input id="name" type="text" {...registerName(register)} />
      </FormField>
      <FormField id="desc" label="Description" required error={showFieldError("desc")}>
        <textarea id="desc" rows={PRODUCT_FORM_RULES.DESCRIPTION_ROWS} {...registerDesc(register)} />
      </FormField>
      <FormField id="price" label="Price" required error={showFieldError("price")}>
        <input id="price" type="number" step={PRODUCT_FORM_RULES.PRICE_STEP} min={PRODUCT_FORM_RULES.PRICE_MIN} {...registerPrice(register)} />
      </FormField>
      <FormField id="category" label="Category" required error={showFieldError("category")}>
        <select id="category" {...registerCategory(register)}>
          <option value="" disabled>Select category</option>
          {PRODUCT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </FormField>
      <FormField id="tags" label="Tags" hint="Comma-separated (optional)">
        <input id="tags" type="text" placeholder="e.g. sale, new, phone" {...register("tags")} />
      </FormField>
      <FormField id="imageUrl" label="Image URL" required error={showFieldError("imageUrl")}>
        <input id="imageUrl" type="url" placeholder="https://example.com/image.jpg" {...registerImageUrl(register)} />
      </FormField>
    </>
  );
}

function registerName(register) {
  return register("name", {
    required: "Name is required",
    minLength: {
      value: PRODUCT_FORM_RULES.NAME_MIN_LENGTH,
      message: "Name must be at least 2 characters",
    },
  });
}

function registerDesc(register) {
  return register("desc", {
    required: "Description is required",
    minLength: {
      value: PRODUCT_FORM_RULES.DESCRIPTION_MIN_LENGTH,
      message: "Description must be at least 10 characters",
    },
  });
}

function registerPrice(register) {
  return register("price", {
    required: "Price is required",
    validate: (v) => Number(v) > 0 || "Price must be greater than 0",
  });
}

function registerCategory(register) {
  return register("category", { required: "Please select a category" });
}

function registerImageUrl(register) {
  return register("imageUrl", {
    required: "Image URL is required",
    validate: (v) => isValidUrl(v.trim()) || "Enter a valid URL (https://...)",
  });
}
