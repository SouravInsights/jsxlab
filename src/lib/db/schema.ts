import { ArtifactMeta } from "@/types/artifact-meta";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
  index,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const artifacts = pgTable(
  "artifacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: varchar("type", { length: 50 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    code: text("code").notNull(),
    meta: jsonb("meta")
      .$type<ArtifactMeta>()
      .default({} as ArtifactMeta)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    typeNameIdx: index("artifacts_type_name_idx").on(table.type, table.name),
    createdAtIdx: index("artifacts_created_at_idx").on(table.createdAt),
    typeIdx: index("artifacts_type_idx").on(table.type),
  })
);

export const artifactVersions = pgTable(
  "artifact_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    artifactId: uuid("artifact_id")
      .references(() => artifacts.id, { onDelete: "cascade" })
      .notNull(),
    version: integer("version").notNull(),
    code: text("code").notNull(),
    meta: jsonb("meta")
      .$type<ArtifactMeta>()
      .default({} as ArtifactMeta)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    artifactIdIdx: index("artifact_versions_artifact_id_idx").on(
      table.artifactId
    ),
    artifactVersionUnique: unique(
      "artifact_versions_artifact_version_unique"
    ).on(table.artifactId, table.version),
    versionIdx: index("artifact_versions_version_idx").on(table.version),
    createdAtIdx: index("artifact_versions_created_at_idx").on(table.createdAt),
  })
);

export type Artifact = typeof artifacts.$inferSelect;
export type NewArtifact = typeof artifacts.$inferInsert;
export type ArtifactVersion = typeof artifactVersions.$inferSelect;
export type NewArtifactVersion = typeof artifactVersions.$inferInsert;
