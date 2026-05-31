-- Add a required email column while keeping existing local users migratable.
ALTER TABLE "users" ADD COLUMN "email" VARCHAR(255);

UPDATE "users"
SET "email" = 'user-' || "id" || '@local.test'
WHERE "email" IS NULL;

ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
