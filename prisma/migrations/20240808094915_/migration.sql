-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "user_id" INTEGER,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);
