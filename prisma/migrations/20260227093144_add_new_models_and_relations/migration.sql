/*
  Warnings:

  - You are about to drop the column `smsTriggerDays` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "smsTriggerDays",
ADD COLUMN     "sms_trigger_days" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "user_details" (
    "user_id" TEXT NOT NULL,
    "notes" TEXT,
    "status_level" INTEGER NOT NULL DEFAULT 0,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_completed_day" INTEGER,
    "pause_tokens_remaining" INTEGER NOT NULL DEFAULT 3,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_details_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_lessons" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'locked',
    "unlocked_at" TIMESTAMPTZ(6),
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "sequential_unlock_override" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_contacts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "friend_phone" TEXT NOT NULL,
    "friend_name" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friend_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_blocks" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_responses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "response_type" TEXT NOT NULL,
    "content" TEXT,
    "audio_url" TEXT,
    "transcription" TEXT,
    "grading" JSONB NOT NULL,
    "submitted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_day" INTEGER NOT NULL,
    "message_variant" TEXT NOT NULL,
    "sent_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sms_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "amount" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_config" (
    "id" TEXT NOT NULL,
    "config_key" TEXT NOT NULL,
    "config_value" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_actions" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_prompts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prompt_type" TEXT NOT NULL,
    "prompt_text" TEXT NOT NULL,
    "rubric" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "goal" TEXT,
    "whatsapp_link" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "circles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circle_members" (
    "id" TEXT NOT NULL,
    "circle_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "circle_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grading" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "response_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "transcription" TEXT,
    "ai_feedback" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "final_feedback" JSONB,
    "admin_edits" JSONB,
    "rejection_reason" TEXT,
    "regeneration_attempts" INTEGER NOT NULL DEFAULT 0,
    "delivered_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_content" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "image_url" TEXT,
    "author" TEXT,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_likes" (
    "id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snoozed_challenges" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "challenge_block_id" TEXT NOT NULL,
    "snoozed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reminder_at" TIMESTAMPTZ(6) NOT NULL,
    "reminder_sent_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "snoozed_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "celebrations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "milestone_type" TEXT NOT NULL,
    "milestone_value" TEXT NOT NULL,
    "animation_shown" BOOLEAN NOT NULL DEFAULT false,
    "email_sent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "celebrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_submissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "screen_name" TEXT NOT NULL,
    "feedback_text" TEXT NOT NULL,
    "linear_ticket_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_details_status_level_idx" ON "user_details"("status_level");

-- CreateIndex
CREATE INDEX "user_details_total_xp_idx" ON "user_details"("total_xp");

-- CreateIndex
CREATE INDEX "user_details_current_streak_idx" ON "user_details"("current_streak");

-- CreateIndex
CREATE INDEX "user_details_last_completed_day_idx" ON "user_details"("last_completed_day");

-- CreateIndex
CREATE INDEX "user_lessons_user_id_idx" ON "user_lessons"("user_id");

-- CreateIndex
CREATE INDEX "user_lessons_lesson_id_idx" ON "user_lessons"("lesson_id");

-- CreateIndex
CREATE INDEX "user_lessons_status_idx" ON "user_lessons"("status");

-- CreateIndex
CREATE INDEX "user_lessons_completed_at_idx" ON "user_lessons"("completed_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_lessons_user_id_lesson_id_key" ON "user_lessons"("user_id", "lesson_id");

-- CreateIndex
CREATE INDEX "friend_contacts_user_id_idx" ON "friend_contacts"("user_id");

-- CreateIndex
CREATE INDEX "friend_contacts_friend_phone_idx" ON "friend_contacts"("friend_phone");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_day_number_key" ON "lessons"("day_number");

-- CreateIndex
CREATE INDEX "lessons_status_idx" ON "lessons"("status");

-- CreateIndex
CREATE INDEX "lesson_blocks_lesson_id_idx" ON "lesson_blocks"("lesson_id");

-- CreateIndex
CREATE INDEX "lesson_blocks_type_idx" ON "lesson_blocks"("type");

-- CreateIndex
CREATE INDEX "lesson_blocks_order_index_idx" ON "lesson_blocks"("order_index");

-- CreateIndex
CREATE INDEX "user_responses_user_id_idx" ON "user_responses"("user_id");

-- CreateIndex
CREATE INDEX "user_responses_lesson_id_idx" ON "user_responses"("lesson_id");

-- CreateIndex
CREATE INDEX "user_responses_block_id_idx" ON "user_responses"("block_id");

-- CreateIndex
CREATE INDEX "user_responses_submitted_at_idx" ON "user_responses"("submitted_at");

-- CreateIndex
CREATE INDEX "sms_logs_user_id_idx" ON "sms_logs"("user_id");

-- CreateIndex
CREATE INDEX "sms_logs_sent_at_idx" ON "sms_logs"("sent_at");

-- CreateIndex
CREATE INDEX "user_activity_user_id_idx" ON "user_activity"("user_id");

-- CreateIndex
CREATE INDEX "user_activity_event_type_idx" ON "user_activity"("event_type");

-- CreateIndex
CREATE INDEX "user_activity_created_at_idx" ON "user_activity"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "admin_config_config_key_key" ON "admin_config"("config_key");

-- CreateIndex
CREATE INDEX "admin_actions_admin_id_idx" ON "admin_actions"("admin_id");

-- CreateIndex
CREATE INDEX "admin_actions_user_id_idx" ON "admin_actions"("user_id");

-- CreateIndex
CREATE INDEX "admin_actions_action_type_idx" ON "admin_actions"("action_type");

-- CreateIndex
CREATE INDEX "admin_actions_created_at_idx" ON "admin_actions"("created_at");

-- CreateIndex
CREATE INDEX "ai_prompts_prompt_type_idx" ON "ai_prompts"("prompt_type");

-- CreateIndex
CREATE INDEX "ai_prompts_is_active_idx" ON "ai_prompts"("is_active");

-- CreateIndex
CREATE INDEX "ai_prompts_created_at_idx" ON "ai_prompts"("created_at");

-- CreateIndex
CREATE INDEX "circles_type_idx" ON "circles"("type");

-- CreateIndex
CREATE INDEX "circles_goal_idx" ON "circles"("goal");

-- CreateIndex
CREATE INDEX "circle_members_circle_id_idx" ON "circle_members"("circle_id");

-- CreateIndex
CREATE INDEX "circle_members_user_id_idx" ON "circle_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "circle_members_circle_id_user_id_key" ON "circle_members"("circle_id", "user_id");

-- CreateIndex
CREATE INDEX "grading_user_id_idx" ON "grading"("user_id");

-- CreateIndex
CREATE INDEX "grading_status_idx" ON "grading"("status");

-- CreateIndex
CREATE INDEX "grading_created_at_idx" ON "grading"("created_at");

-- CreateIndex
CREATE INDEX "feed_content_published_at_idx" ON "feed_content"("published_at");

-- CreateIndex
CREATE INDEX "feed_content_type_idx" ON "feed_content"("type");

-- CreateIndex
CREATE INDEX "feed_content_is_pinned_idx" ON "feed_content"("is_pinned");

-- CreateIndex
CREATE INDEX "feed_likes_content_id_idx" ON "feed_likes"("content_id");

-- CreateIndex
CREATE INDEX "feed_likes_user_id_idx" ON "feed_likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "feed_likes_content_id_user_id_key" ON "feed_likes"("content_id", "user_id");

-- CreateIndex
CREATE INDEX "snoozed_challenges_user_id_idx" ON "snoozed_challenges"("user_id");

-- CreateIndex
CREATE INDEX "snoozed_challenges_reminder_at_idx" ON "snoozed_challenges"("reminder_at");

-- CreateIndex
CREATE INDEX "celebrations_user_id_idx" ON "celebrations"("user_id");

-- CreateIndex
CREATE INDEX "celebrations_milestone_type_idx" ON "celebrations"("milestone_type");

-- CreateIndex
CREATE INDEX "celebrations_created_at_idx" ON "celebrations"("created_at");

-- CreateIndex
CREATE INDEX "feedback_submissions_user_id_idx" ON "feedback_submissions"("user_id");

-- CreateIndex
CREATE INDEX "feedback_submissions_category_idx" ON "feedback_submissions"("category");

-- CreateIndex
CREATE INDEX "feedback_submissions_created_at_idx" ON "feedback_submissions"("created_at");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- AddForeignKey
ALTER TABLE "user_details" ADD CONSTRAINT "user_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lessons" ADD CONSTRAINT "user_lessons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lessons" ADD CONSTRAINT "user_lessons_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_contacts" ADD CONSTRAINT "friend_contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_blocks" ADD CONSTRAINT "lesson_blocks_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_responses" ADD CONSTRAINT "user_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_responses" ADD CONSTRAINT "user_responses_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_responses" ADD CONSTRAINT "user_responses_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "lesson_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms_logs" ADD CONSTRAINT "sms_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circle_members" ADD CONSTRAINT "circle_members_circle_id_fkey" FOREIGN KEY ("circle_id") REFERENCES "circles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circle_members" ADD CONSTRAINT "circle_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading" ADD CONSTRAINT "grading_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading" ADD CONSTRAINT "grading_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "user_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading" ADD CONSTRAINT "grading_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_likes" ADD CONSTRAINT "feed_likes_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "feed_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_likes" ADD CONSTRAINT "feed_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snoozed_challenges" ADD CONSTRAINT "snoozed_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snoozed_challenges" ADD CONSTRAINT "snoozed_challenges_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snoozed_challenges" ADD CONSTRAINT "snoozed_challenges_challenge_block_id_fkey" FOREIGN KEY ("challenge_block_id") REFERENCES "lesson_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "celebrations" ADD CONSTRAINT "celebrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_submissions" ADD CONSTRAINT "feedback_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
