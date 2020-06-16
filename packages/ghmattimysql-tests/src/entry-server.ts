import setup from "./tests/setup";
import cleanup from "./tests/cleanup";
// Tests
import Insert from "./tests/insert";
import Update from "./tests/update";
import Store from "./tests/store";
import Select from "./tests/select";
import Transaction from "./tests/transactions";

async function run() {
  // Setup Environment
  await setup();
  // Run Actual Tests
  await Insert.run();
  await Update.run();
  await Store.run();
  await Select.run();
  await Transaction.run();
  // Cleanup
  cleanup();
}

run();
