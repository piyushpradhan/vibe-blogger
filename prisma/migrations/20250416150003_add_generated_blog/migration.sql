-- CreateTable
CREATE TABLE "GeneratedBlog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedBlog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GeneratedBlog_sessionId_idx" ON "GeneratedBlog"("sessionId");

-- CreateIndex
CREATE INDEX "GeneratedBlog_userId_idx" ON "GeneratedBlog"("userId");

-- AddForeignKey
ALTER TABLE "GeneratedBlog" ADD CONSTRAINT "GeneratedBlog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedBlog" ADD CONSTRAINT "GeneratedBlog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
