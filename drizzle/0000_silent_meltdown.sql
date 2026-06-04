CREATE TABLE "adaptations" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"adaptation_type" varchar(50) NOT NULL,
	"adapted_markdown" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "session_series" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"age_grade" varchar(50) NOT NULL,
	"total_sessions" integer,
	"current_session" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"series_id" integer,
	"session_number" integer DEFAULT 1 NOT NULL,
	"title" varchar(255) NOT NULL,
	"age_grade" varchar(50) NOT NULL,
	"gender" varchar(20) NOT NULL,
	"player_count" integer NOT NULL,
	"ability_level" varchar(50) NOT NULL,
	"session_length" integer NOT NULL,
	"topic" varchar(255) NOT NULL,
	"principle" varchar(255) NOT NULL,
	"struggles" text,
	"desired_outcome" text,
	"contact_level" varchar(50) NOT NULL,
	"equipment" text,
	"space" text,
	"plan_markdown" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "adaptations" ADD CONSTRAINT "adaptations_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adaptations" ADD CONSTRAINT "adaptations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_series" ADD CONSTRAINT "session_series_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_series_id_session_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."session_series"("id") ON DELETE cascade ON UPDATE no action;