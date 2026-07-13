-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_moduleId_fkey";

-- AlterTable
ALTER TABLE "CourseModule" ADD COLUMN "isCompleted" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Progress";
