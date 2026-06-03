/**
 * File schema meta: validate request quan ly category va tag.
 */
import { z } from "zod";

const ENTITY_NAME_MAX_LENGTH = 50;

const entityIdParamsSchema = z.object({
  id: z.string().regex(/^[1-9]\d*$/, "Invalid id"),
});

const entityBodySchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(
      ENTITY_NAME_MAX_LENGTH,
      `Name must be ${ENTITY_NAME_MAX_LENGTH} characters or fewer.`,
    ),
});

export const createNamedEntityRequestSchema = z.object({
  body: entityBodySchema,
});

export const updateNamedEntityRequestSchema = z.object({
  body: entityBodySchema,
  params: entityIdParamsSchema,
});

export const deleteNamedEntityRequestSchema = z.object({
  params: entityIdParamsSchema,
});

export type NamedEntityRequest = z.infer<typeof entityBodySchema>;
