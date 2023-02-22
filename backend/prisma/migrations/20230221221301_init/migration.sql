/*
  Warnings:

  - Added the required column `id_veiculo` to the `Operacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `operacao` ADD COLUMN `id_veiculo` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Operacao` ADD CONSTRAINT `Operacao_id_veiculo_fkey` FOREIGN KEY (`id_veiculo`) REFERENCES `Veiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
