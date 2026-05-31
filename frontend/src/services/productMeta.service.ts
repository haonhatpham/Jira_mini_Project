import api from "../api/axiosInstance";
import { API_PATHS } from "../api/paths";
import { createSignalConfig, type RequestOptions } from "../api/requestConfig";
import type { CategoryOption, TagOption } from "../types";

export const productMetaService = {
  async getCategories(options: RequestOptions = {}): Promise<CategoryOption[]> {
    const { data } = await api.get<CategoryOption[]>(
      API_PATHS.CATEGORIES.LIST,
      createSignalConfig(options),
    );
    return data;
  },

  async getTags(options: RequestOptions = {}): Promise<TagOption[]> {
    const { data } = await api.get<TagOption[]>(
      API_PATHS.TAGS.LIST,
      createSignalConfig(options),
    );
    return data;
  },
};
