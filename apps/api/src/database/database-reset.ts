import DataSource from '../config/typeorm/configuration';
import { QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

const logger = new Logger('DatabaseReset');

DataSource.initialize()
  .then(async () => {
    logger.log('Data source initialized successfully');

    const queryRunner: QueryRunner = DataSource.createQueryRunner();

    try {
      await queryRunner.connect();

      logger.log('Dropping jobs and files tables...');
      await queryRunner.dropTable('jobs', true);
      await queryRunner.dropTable('files', true);
      logger.log('Dropped jobs and files tables successfully');

      logger.log('Running migrations...');
      await DataSource.runMigrations();
      logger.log('Running migrations completed successfully');

      logger.log('Database reset completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error(`Error while resetting database: ${error}`);
      process.exit(1);
    } finally {
      await queryRunner.release();
    }
  })
  .catch((error) => {
    logger.error(`Error while initializing data source: ${error}`);
    process.exit(1);
  });
