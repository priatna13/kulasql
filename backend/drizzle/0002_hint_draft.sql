CREATE TABLE "challenge_drafts" (
	"user_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"body" text NOT NULL,
	"revision" bigint NOT NULL,
	"cleared" boolean NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "challenge_drafts_user_id_slug_pk" PRIMARY KEY("user_id","slug")
);
--> statement-breakpoint
CREATE TABLE "hint_opens" (
	"user_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"opened_level" integer NOT NULL,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hint_opens_user_id_slug_pk" PRIMARY KEY("user_id","slug")
);
--> statement-breakpoint
ALTER TABLE "challenge_drafts" ADD CONSTRAINT "challenge_drafts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hint_opens" ADD CONSTRAINT "hint_opens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;