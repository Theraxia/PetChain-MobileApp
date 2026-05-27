-- Rollback 006: Blockchain transaction audit table

DROP TABLE IF EXISTS blockchain_transactions;

DELETE FROM schema_migrations WHERE version = 6;
