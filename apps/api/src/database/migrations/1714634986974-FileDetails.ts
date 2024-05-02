import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class FileDetails1714634986974 implements MigrationInterface {
    name = 'FileDetails1714634986974';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'files',
                columns: [
                    {
                        name: 'file_id',
                        type: 'int(15)',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'file_path',
                        type: 'varchar(255)',
                    },
                    {
                        name: 'file_name',
                        type: 'varchar(255)',
                    },
                    {
                        name: 'created_on',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'modified_on',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'created_by',
                        type: 'varchar',
                    },
                    {
                        name: 'modified_by',
                        type: 'varchar',
                    },
                    {
                        name: 'status',
                        type: 'tinyint',
                        default: 1,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`files\``);
    }

}
