import { seed } from './seedData';
import { closePool } from '../src/db';

// CLI entry point: `ts-node seeds/index.ts [--owners N] [--vets N] [--pets N] [--records N] [--appointments N] [--medications N] [--preset minimal|standard|large] [--seedBlockchain true|false] [--clean]`
async function main() {
  const args = process.argv.slice(2);
  const config: Record<string, unknown> = {};

  const flagMap: Record<string, string> = {
    owners: 'numOwners',
    vets: 'numVets',
    pets: 'petsPerOwner',
    records: 'recordsPerPet',
    appointments: 'appointmentsPerPet',
    medications: 'medicationsPerPet',
    preset: 'preset',
    seedBlockchain: 'seedBlockchain',
    clean: 'clean',
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.replace(/^--/, '');
    const configKey = flagMap[key];
    if (!configKey) continue;

    const next = args[i + 1];
    if (key === 'clean') {
      config[configKey] = true;
      continue;
    }

    if (!next || next.startsWith('--')) {
      if (key === 'seedBlockchain') {
        config[configKey] = true;
      }
      continue;
    }

    if (['owners', 'vets', 'pets', 'records', 'appointments', 'medications'].includes(key)) {
      const value = parseInt(next, 10);
      if (!Number.isNaN(value)) {
        config[configKey] = value;
        i += 1;
      }
      continue;
    }

    if (key === 'seedBlockchain') {
      config[configKey] = next.toLowerCase() !== 'false';
      i += 1;
      continue;
    }

    config[configKey] = next;
    i += 1;
  }

  try {
    await seed(config);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await closePool();
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

export { seed };
