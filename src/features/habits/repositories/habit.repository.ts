import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { habits } from '@/db/schema';

export const habitRepository = {
  async findAll() {
    return db
      .select()
      .from(habits);
  },

  async findById(id: string) {
    const result = await db
      .select()
      .from(habits)
      .where(eq(habits.id, id));

    return result[0] ?? null;
  },

  async create(data: typeof habits.$inferInsert) {
    const result = await db
      .insert(habits)
      .values(data)
      .returning();

    return result[0];
  },

  async update(
    id: string,
    data: Partial<typeof habits.$inferInsert>,
  ) {
    const result = await db
      .update(habits)
      .set(data)
      .where(eq(habits.id, id))
      .returning();

    return result[0] ?? null;
  },

  async delete(id: string) {
    await db
      .delete(habits)
      .where(eq(habits.id, id));
  },
};