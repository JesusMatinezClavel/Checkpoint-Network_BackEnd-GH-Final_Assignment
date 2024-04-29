import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Uploads1714409184938 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'uploads',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false
                    },
                    {
                        name: 'path',
                        type: 'varchar',
                        length: '500',
                        isNullable: false
                    },
                    {
                        name: 'description',
                        type: 'text'
                    },
                    {
                        name: 'downloadable',
                        type: 'boolean',
                        default: false
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                        onUpdate: 'now()'
                    },
                    {
                        name: 'author',
                        type: 'int'
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ['author'],
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('uploads')
    }

}
