-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "bio" TEXT,
    "imageUrl" TEXT,
    "bgType" TEXT NOT NULL DEFAULT 'color',
    "bgValue" TEXT NOT NULL DEFAULT '#f5f5f5',
    "nomeColor" TEXT NOT NULL DEFAULT '#1e293b',
    "bioColor" TEXT NOT NULL DEFAULT '#64748b',
    "linkColor" TEXT NOT NULL DEFAULT '#2563eb',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT DEFAULT '#2563eb',
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
