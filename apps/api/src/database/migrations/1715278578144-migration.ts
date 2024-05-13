import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Migration1715278578144 implements MigrationInterface {
  name = 'Migration1715278578144';

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
            default: 1,
          },
          {
            name: 'input_file',
            type: 'text',
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
            default: "'admin'",
          },
          {
            name: 'modified_by',
            type: 'varchar',
            default: "'admin'",
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
