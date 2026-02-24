import { Command } from 'commander';
import { registerInstall } from './commands/install.js';
import { registerConfigure } from './commands/configure.js';
import { registerUpdate } from './commands/update.js';
import { registerList } from './commands/list.js';
import { registerSetup } from './commands/setup.js';
import { registerInit } from './commands/init.js';
import { registerDoctor } from './commands/doctor.js';
import { registerUninstall } from './commands/uninstall.js';

const program = new Command();

program
  .name('sales-iq')
  .description('CLI for installing sales-iq skills and configuring the MCP server')
  .version('0.1.0');

registerInstall(program);
registerConfigure(program);
registerUpdate(program);
registerList(program);
registerSetup(program);
registerInit(program);
registerDoctor(program);
registerUninstall(program);

await program.parseAsync(process.argv);
