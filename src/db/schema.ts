import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  completed: integer("completed", {
    mode: "boolean",
  })
    .notNull()
    .default(false),

  priority: text("priority", {
    enum: ["low", "medium", "high"],
  })
    .notNull()
    .default("medium"),

  createdAt: integer("created_at", {
    mode: "timestamp",
  }).notNull(),

  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
});

export const habitCategories = sqliteTable(
  "habit_categories",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    position: integer("position")
      .notNull()
      .default(0),
    createdAt: integer("created_at", {
      mode: "timestamp",
    }).notNull(),
    updatedAt: integer("updated_at", {
      mode: "timestamp",
    }).notNull(),
  },
);

export const habits = sqliteTable("habits", {
  id: text("id").primaryKey(),
  categoryId: text("category_id")
    .notNull()
    .references(() => habitCategories.id),
  title: text("title").notNull(),
  createdAt: integer("created_at", {
    mode: "timestamp",
  }).notNull(),
  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
});

export const habitCompletions = sqliteTable(
  "habit_completions",
  {
    id: text("id").primaryKey(),

    habitId: text("habit_id")
      .notNull()
      .references(() => habits.id),

    date: text("date").notNull(),

    completed: integer("completed", {
      mode: "boolean",
    })
      .notNull()
      .default(true),
  },
);