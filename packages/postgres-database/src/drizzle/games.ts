import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const games = pgTable('Game', { id: serial('id').primaryKey(), pgn: text('pgn').notNull() });