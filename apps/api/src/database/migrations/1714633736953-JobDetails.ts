import { MigrationInterface, QueryRunner, Table, TableForeignKey, } from "typeorm";

export class JobDetails1714633736953 implements MigrationInterface {
    name = 'JobDetails1714633736953';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'jobs',
                columns: [
                    {
                        name: 'job_id',
                        type: 'int(15)',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'job_status',
                        type: 'enum("FINISHED", "PROCESSING", "QUEUED", "PENDING")',
                    },
                    {
                        name: 'input_file',
                        type: 'int(15)',
                        isNullable: true,
                    },
                    {
                        name: 'output_file',
                        type: 'int(15)',
                        isNullable: true,
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
        await queryRunner.createForeignKey(
            'jobs',
            new TableForeignKey({
                columnNames: ['input_file'],
                referencedColumnNames: ['file_id'],
                referencedTableName: 'files',
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'jobs',
            new TableForeignKey({
                columnNames: ['output_file'],
                referencedColumnNames: ['file_id'],
                referencedTableName: 'files',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`jobs\``);
        await queryRunner.dropForeignKey('input_file_key', 'input_file');
        await queryRunner.dropForeignKey('output_file_key', 'output_file');

    }

}
