require("dotenv").config();
const PORT = process.env.PORT;
const TEST_URL =
  `http://localhost:${PORT}/api/properties?minPrice=300000&beds=3&limit=20&offset=0`;

async function run() {
  const response = await fetch(TEST_URL);
  const data = await response.json();

  const bug = data.results.find((property) => {
    return Number(property.L_SystemPrice) < 300000 || Number(property.L_Keyword2) !== 3;
  });

  if (bug) {
    console.error("Found a result that does not match both filters");
    console.error(bug);
    process.exit(1);
  }

  console.log("Results match the minPrice & beds filters");
  console.log(`Checked ${data.results.length} results out of ${data.total} matches`);
}

run();