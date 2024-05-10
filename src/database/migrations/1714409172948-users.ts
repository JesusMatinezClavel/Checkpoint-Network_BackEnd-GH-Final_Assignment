import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Users1714409172948 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
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
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: 'avatar',
                        type: 'varchar',
                        length: '255',
                        isNullable: true
                    },
                    {
                        name: 'bio',
                        type: 'varchar',
                        length: '255',
                        isNullable: true
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        length: '255',
                        isNullable: false
                    },
                    {
                        name: 'isActive',
                        type: 'boolean',
                        default: false
                    },
                    {
                        name: 'role_id',
                        type: 'int',
                        default: 1
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
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ['role_id'],
                        referencedTableName: 'roles',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
    }

}
