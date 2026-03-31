-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dt_container" (
    "id" SERIAL NOT NULL,
    "container_no" TEXT NOT NULL,
    "container_type" TEXT NOT NULL,
    "container_size" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "dt_container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dt_giam_dinh" (
    "id" SERIAL NOT NULL,
    "container_id" INTEGER NOT NULL,
    "surveyor_id" INTEGER NOT NULL,
    "inspection_code" TEXT NOT NULL,
    "inspection_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "result" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dt_giam_dinh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dt_hu_hong" (
    "id" SERIAL NOT NULL,
    "giam_dinh_id" INTEGER NOT NULL,
    "damage_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "damage_position" TEXT NOT NULL,
    "description" TEXT,
    "repair_method" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dt_hu_hong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dt_hu_hong_image" (
    "id" SERIAL NOT NULL,
    "hu_hong_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_name" TEXT NOT NULL,
    "sort_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dt_hu_hong_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dt_container_container_no_key" ON "dt_container"("container_no");

-- CreateIndex
CREATE UNIQUE INDEX "dt_giam_dinh_inspection_code_key" ON "dt_giam_dinh"("inspection_code");

-- CreateIndex
CREATE INDEX "dt_giam_dinh_container_id_idx" ON "dt_giam_dinh"("container_id");

-- CreateIndex
CREATE INDEX "dt_giam_dinh_surveyor_id_idx" ON "dt_giam_dinh"("surveyor_id");

-- CreateIndex
CREATE INDEX "dt_hu_hong_giam_dinh_id_idx" ON "dt_hu_hong"("giam_dinh_id");

-- CreateIndex
CREATE INDEX "dt_hu_hong_image_hu_hong_id_idx" ON "dt_hu_hong_image"("hu_hong_id");

-- AddForeignKey
ALTER TABLE "dt_giam_dinh" ADD CONSTRAINT "dt_giam_dinh_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "dt_container"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_giam_dinh" ADD CONSTRAINT "dt_giam_dinh_surveyor_id_fkey" FOREIGN KEY ("surveyor_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_hu_hong" ADD CONSTRAINT "dt_hu_hong_giam_dinh_id_fkey" FOREIGN KEY ("giam_dinh_id") REFERENCES "dt_giam_dinh"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dt_hu_hong_image" ADD CONSTRAINT "dt_hu_hong_image_hu_hong_id_fkey" FOREIGN KEY ("hu_hong_id") REFERENCES "dt_hu_hong"("id") ON DELETE CASCADE ON UPDATE CASCADE;
