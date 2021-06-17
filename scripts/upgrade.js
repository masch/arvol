const deploymentParams = require('../deployment-params');

async function main() {
  const Arvolv2 = await ethers.getContractFactory("Arvol");
  console.log("Upgrading proxy contract...");
  const Arvolv2Address = await upgrades.upgradeProxy(deploymentParams.PROXY_CONTRACT_ADDRESS_KOVAN, Arvolv2, { unsafeAllowCustomTypes: true });
  console.log("Proxy has been upgraded with Arvol contract at:", Arvolv2Address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
