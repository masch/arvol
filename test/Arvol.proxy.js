const { default: BigNumber } = require("bignumber.js");
const { expect } = require("chai");
const { constants } = require('@openzeppelin/test-helpers');
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
      oneAddress = addresses[1];
      anotherAddress = addresses[2];

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


    it("happy path - Transfer an amount of token.", async () => {
      // Check the admin account balance has the initial supply value.
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal(deploymentParams.INITIAL_SUPPLY);
      // Check the destiny account balance is 0.
      expect((await arvol.balanceOf(oneAddress)).toString()).to.equal('0');

      // Call the transfer method and check the Transfer event is emit.
      await expect(arvol.transfer(oneAddress, 1000000000000000)).to.emit(arvol, "Transfer");
      
      // Check the admin account balance has the initial supply value minus the amount transferred.
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999999000000000000000');
      // Check the destiny account balance receives the amount transferred.
      expect((await arvol.balanceOf(oneAddress)).toString()).to.equal('1000000000000000');
    });  

    it("require fail - Transfer with zero address.", async () => {
      // Check the admin account balance has the amount expected.
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999999000000000000000');

      // Call the transfer method MUST fail because is trying to transfer more than the amount the account owns
      await expect(
        arvol.transfer(constants.ZERO_ADDRESS, '9999999999000000000000001')
      ).to.be.revertedWith(
        "ERC20: transfer to the zero address"
      );

      // Check the admin account balance is not affected.
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999999000000000000000');
    });

    it("require fail - Transfer an amount of token than the admin account owns.", async () => {
      // Check the admin account balance has the amount expected.
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999999000000000000000');
      // Check the destiny account balance has the amount expected.
      expect((await arvol.balanceOf(oneAddress)).toString()).to.equal('1000000000000000');

      // Call the transfer method MUST fail because is trying to transfer more than the amount the account owns
      await expect(
        arvol.transfer(oneAddress, '9999999999000000000000001')
      ).to.be.revertedWith(
        "ERC20: transfer amount exceeds balance"
      );

      // Check the admin account balance is not affected.
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999999000000000000000');
      // Check the destiny account balance is not affected.
      expect((await arvol.balanceOf(oneAddress)).toString()).to.equal('1000000000000000');
    });

    it("require fail - Approve with zero address.", async () => {
      // Call the approve method with account with zero address MUST fail because is an invalid address
      await expect(
        arvol.approve(constants.ZERO_ADDRESS, 123)
      ).to.be.revertedWith(
        "ERC20: approve to the zero address"
      );
    });

    it("happy path - Approve spend token.", async () => {
      // Check the allowance value from admin address to one address is 0 before the approve call method.
      expect((await arvol.allowance(adminAddress, adminAddress)).toString()).to.equal('0');
      // Check the admin account balance has the amount expected.
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999999000000000000000');

      // Call the approve method to one address account and check the Approval event is emit.
      await expect(arvol.approve(adminAddress, 12345)).to.emit(arvol, "Approval");


      // Check the allowance value from admin address to one address is the one used on the approve call (12345).
      expect((await arvol.allowance(adminAddress, adminAddress)).toString()).to.equal('12345');
      // Check the admin account balance has the amount expected.
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999999000000000000000');
    });  

    it("require fail - Can't transfer more amount than was approved.", async () => {
      // Check the allowance value from admin address to one address is the one used on the approve call (12345).
      expect((await arvol.allowance(adminAddress, adminAddress)).toString()).to.equal('12345');
      // Check the admin account balance has the amount expected.
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999999000000000000000');
      // Check the admin account balance has the amount expected.
      expect((await arvol.balanceOf(oneAddress)).toString()).to.equal('1000000000000000');


      // Call the transfer method with more than amount allowed MUST fail.
      await expect(
        arvol.transferFrom(adminAddress, oneAddress, 12346)
      ).to.be.revertedWith(
        "SafeMath: subtraction overflow"
      );


      // Check the allowance value from admin address to one address is the one used on the approve call (12345).
      expect((await arvol.allowance(adminAddress, adminAddress)).toString()).to.equal('12345');
      // Check the admin account balance has the amount expected.
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999999000000000000000');
      // Check the admin account balance has the amount expected.
      expect((await arvol.balanceOf(oneAddress)).toString()).to.equal('1000000000000000');
    });  

    it("happy path - Approve transfer some tokens less than allowed.", async () => {
      expect((await arvol.allowance(adminAddress, adminAddress)).toString()).to.equal('12345');
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999999000000000000000');
      expect((await arvol.balanceOf(oneAddress)).toString()).to.equal('1000000000000000');


      await expect(arvol.transferFrom(adminAddress, oneAddress, 1000)).to.emit(arvol, "Approval");


      expect((await arvol.allowance(adminAddress, adminAddress)).toString()).to.equal('11345');
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999998999999999999000')
      expect((await arvol.balanceOf(oneAddress)).toString()).to.equal('1000000000001000');
    });

    it("happy path - Approve transfer all remained allowed token.", async () => {
      expect((await arvol.allowance(adminAddress, adminAddress)).toString()).to.equal('11345');
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999998999999999999000')
      expect((await arvol.balanceOf(oneAddress)).toString()).to.equal('1000000000001000');


      await expect(arvol.transferFrom(adminAddress, oneAddress, 11345)).to.emit(arvol, "Approval");


      expect((await arvol.allowance(adminAddress, adminAddress)).toString()).to.equal('0');
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999998999999999987655')
      expect((await arvol.balanceOf(oneAddress)).toString()).to.equal('1000000000012345');
    });  

    it("require fail - Since all the tokens allowed were transferred, MUST fail any transfer.", async () => {
      expect((await arvol.allowance(adminAddress, adminAddress)).toString()).to.equal('0');
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999998999999999987655')
      expect((await arvol.balanceOf(oneAddress)).toString()).to.equal('1000000000012345');


      await expect(
        arvol.transferFrom(adminAddress, oneAddress, 1)
      ).to.be.revertedWith(
        "SafeMath: subtraction overflow"
      );


      expect((await arvol.allowance(adminAddress, adminAddress)).toString()).to.equal('0');
      expect((await arvol.balanceOf(adminAddress)).toString()).to.equal('9999999998999999999987655')
      expect((await arvol.balanceOf(oneAddress)).toString()).to.equal('1000000000012345');
    });
  });
})
