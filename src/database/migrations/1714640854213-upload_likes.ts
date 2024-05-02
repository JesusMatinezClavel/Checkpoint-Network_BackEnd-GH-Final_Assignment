import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UploadLikes1714640854213 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'upload_likes',
            columns: [
                {
                    name: 'upload_id',
                    type: 'int',
                    isPrimary: true
                },
                {
                    name: 'user_id',
                    type: 'int',
                    isPrimary: true
                }
            ],
            foreignKeys: [
                {
                    columnNames: ['upload_id'],
                    referencedTableName: 'uploads',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE'
                },
                {
                    columnNames: ['user_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('upload_likes')
    }

}
