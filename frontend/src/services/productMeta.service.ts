import api from "../api/axiosInstance";
import { API_PATHS } from "../api/paths";
import { createSignalConfig, type RequestOptions } from "../api/requestConfig";
import type { CategoryOption, TagOption } from "../types";

type NamedEntityPayload = {
  name: string;
};

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

  async createCategory(
    payload: NamedEntityPayload,
    options: RequestOptions = {},
  ): Promise<CategoryOption> {
    const { data } = await api.post<CategoryOption>(
      API_PATHS.CATEGORIES.CREATE,
      payload,
      createSignalConfig(options),
    );
    return data;
  },

  async updateCategory(
    id: number | string,
    payload: NamedEntityPayload,
    options: RequestOptions = {},
  ): Promise<CategoryOption> {
    const { data } = await api.put<CategoryOption>(
      API_PATHS.CATEGORIES.UPDATE(id),
      payload,
      createSignalConfig(options),
    );
    return data;
  },

  async deleteCategory(
    id: number | string,
    options: RequestOptions = {},
  ): Promise<void> {
    await api.delete(
      API_PATHS.CATEGORIES.DELETE(id),
      createSignalConfig(options),
    );
  },

  async createTag(
    payload: NamedEntityPayload,
    options: RequestOptions = {},
  ): Promise<TagOption> {
    const { data } = await api.post<TagOption>(
      API_PATHS.TAGS.CREATE,
      payload,
      createSignalConfig(options),
    );
    return data;
  },

  async updateTag(
    id: number | string,
    payload: NamedEntityPayload,
    options: RequestOptions = {},
  ): Promise<TagOption> {
    const { data } = await api.put<TagOption>(
      API_PATHS.TAGS.UPDATE(id),
      payload,
      createSignalConfig(options),
    );
    return data;
  },

  async deleteTag(
    id: number | string,
    options: RequestOptions = {},
  ): Promise<void> {
    await api.delete(API_PATHS.TAGS.DELETE(id), createSignalConfig(options));
  },
};
