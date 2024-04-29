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
                        length: '500'
                    },
                    {
                        name: 'bio',
                        type: 'text'
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
                        length: '20',
                    },
                    {
                        name: 'birthdate',
                        type: 'timestamp',
                    },
                    {
                        name: 'isActive',
                        type: 'boolean',
                        default: false
                    },
                    {
                        name: 'role_id',
                        type: 'int',
                        isNullable: false
                    },
                    {
                        name: 'followers',
                        type: 'int'
                    },
                    {
                        name: 'following',
                        type: 'int'
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
                    },
                    {
                        columnNames: ['followers'],
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE'
                    },
                    {
                        columnNames: ['following'],
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE'
                    },
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
    }

}
