import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UploadComments1714409199309 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'upload_comments',
                columns:[
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'message',
                        type: 'text',
                        length:'255'
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
                        name:'author_id',
                        type:'int'
                    },
                    {
                        name:'upload_id',
                        type:'int'
                    }
                ],
                foreignKeys:[
                    {
                        columnNames:['author_id'],
                        referencedTableName:'users',
                        referencedColumnNames:['id'],
                        onDelete:'CASCADE'
                    },
                    {
                        columnNames:['upload_id'],
                        referencedTableName:'uploads',
                        referencedColumnNames:['id'],
                        onDelete:'CASCADE'
                    },
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('upload_comments')
    }

}
