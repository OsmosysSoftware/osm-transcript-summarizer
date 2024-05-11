import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migration1714646233635 implements MigrationInterface {

    name = 'Migration1714646233635';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'summary',
                columns: [
                    {
                        name: 'job_id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'job_status',
                        type: 'tinyint',
                    },
                    {
                        name: 'input_file',
                        type: 'int',
                    },
                    {
                        name: 'output_text',
                        type: 'text',
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`summary\``);
    }

}
