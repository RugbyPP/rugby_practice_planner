import { pgTable, text, timestamp, integer, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Session series (progression blocks)
export const sessionSeries = pgTable('session_series', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  ageGrade: varchar('age_grade', { length: 50 }).notNull(),
  totalSessions: integer('total_sessions'),
  currentSession: integer('current_session'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Individual sessions
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  seriesId: integer('series_id').references(() => sessionSeries.id, { onDelete: 'cascade' }),
  sessionNumber: integer('session_number').notNull().default(1),
  title: varchar('title', { length: 255 }).notNull(),
  ageGrade: varchar('age_grade', { length: 50 }).notNull(),
  gender: varchar('gender', { length: 20 }).notNull(),
  playerCount: integer('player_count').notNull(),
  abilityLevel: varchar('ability_level', { length: 50 }).notNull(),
  sessionLength: integer('session_length').notNull(),
  topic: varchar('topic', { length: 255 }).notNull(),
  principle: varchar('principle', { length: 255 }).notNull(),
  struggles: text('struggles'),
  desiredOutcome: text('desired_outcome'),
  contactLevel: varchar('contact_level', { length: 50 }).notNull(),
  equipment: text('equipment'),
  space: text('space'),
  planMarkdown: text('plan_markdown').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Adaptation history (track variants generated from sessions)
export const adaptations = pgTable('adaptations', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  adaptationType: varchar('adaptation_type', { length: 50 }).notNull(),
  adaptedMarkdown: text('adapted_markdown').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  series: many(sessionSeries),
}));

export const sessionSeriesRelations = relations(sessionSeries, ({ one, many }) => ({
  user: one(users, { fields: [sessionSeries.userId], references: [users.id] }),
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
  series: one(sessionSeries, { fields: [sessions.seriesId], references: [sessionSeries.id] }),
  adaptations: many(adaptations),
}));

export const adaptationsRelations = relations(adaptations, ({ one }) => ({
  session: one(sessions, { fields: [adaptations.sessionId], references: [sessions.id] }),
  user: one(users, { fields: [adaptations.userId], references: [users.id] }),
}));
