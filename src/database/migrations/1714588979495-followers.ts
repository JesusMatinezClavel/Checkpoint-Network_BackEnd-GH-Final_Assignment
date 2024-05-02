import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Followers1714588979495 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'followers',
                columns: [
                    {
                        name: 'followerId',
                        type: 'int',
                        isPrimary: true,
                        isNullable: false
                    },
                    {
                        name: 'followingId',
                        type: 'int',
                        isPrimary: true,
                        isNullable: false
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ['followerId'],
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE'
                    },
                    {
                        columnNames: ['followingId'],
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE'
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
    }

}
