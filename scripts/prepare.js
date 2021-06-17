const deploymentParams = require('../deployment-params');

async function main() {
  const Arvolv2 = await ethers.getContractFactory("Arvol");
  console.log("Preparing upgrade...");
  const Arvolv2Address = await upgrades.prepareUpgrade(deploymentParams.PROXY_CONTRACT_ADDRESS_KOVAN, Arvolv2, { unsafeAllowCustomTypes: true });
  console.log("A new version of Arvol was deployed at:", Arvolv2Address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });