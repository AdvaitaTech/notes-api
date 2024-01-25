CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200),
	"email" varchar(200) NOT NULL,
	"password" varchar(200) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
