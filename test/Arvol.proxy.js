const { default: BigNumber } = require("bignumber.js");
const { expect } = require("chai");
const deploymentParams = require('../deployment-params');

/**
 @summary Tests for Arvol.sol
*/
contract('Arvol.sol', accounts => {
  describe('{{Arvol Coin}}', () => {
    before(async () => {
      accounts = await ethers.getSigners();

      const [_addresses] = await Promise.all([
        Promise.all(accounts.map((account) => account.getAddress())),
      ]);

      addresses = _addresses;
      adminAddress = addresses[0];

      ArvolCoin = await ethers.getContractFactory("Arvol");

      arvol = await upgrades.deployProxy(ArvolCoin,
        [deploymentParams.INITIAL_SUPPLY, deploymentParams.TOKEN_NAME, deploymentParams.TOKEN_SYMBOL],
        { initializer: 'initialize', unsafeAllowCustomTypes: true }
      );

    });

    it("happy path - return a value previously initialized.", async () => {
      // Check that the initial supply value passed to the constructor is set.
      expect((await arvol._totalSupply()).toString()).to.equal(deploymentParams.INITIAL_SUPPLY.toString());

      // Check that the token name value passed to the constructor is set.
      expect((await arvol._name()).toString()).to.equal(deploymentParams.TOKEN_NAME.toString());

      // Check that the token symbol value passed to the constructor is set.
      expect((await arvol._symbol()).toString()).to.equal(deploymentParams.TOKEN_SYMBOL.toString());

      // Check that the decimals tokens value is set on the constructor.
      expect((await arvol._decimals())).to.equal(18);

      // Check that the initial supply value is set on the admin address account on the constructor.
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal(deploymentParams.INITIAL_SUPPLY);
    });

  });
})
