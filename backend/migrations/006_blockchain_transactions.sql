-- Migration 006: Blockchain transaction audit table
-- Adds a dedicated blockchain transaction history table for seeded record anchoring.

CREATE TABLE IF NOT EXISTS blockchain_transactions (
  id UUID PRIMARY KEY,
  record_id UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  record_hash TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  ledger_sequence INTEGER,
  status TEXT NOT NULL CHECK (status IN ('pending', 'submitted', 'confirmed', 'failed')),
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_record_id ON blockchain_transactions(record_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_transaction_id ON blockchain_transactions(transaction_id);

INSERT INTO schema_migrations (version, name)
  VALUES (6, '006_blockchain_transactions')
  ON CONFLICT (version) DO NOTHING;
