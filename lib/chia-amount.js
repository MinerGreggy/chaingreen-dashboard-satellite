const BigNumber = require('bignumber.js');

class ChainGreenAmount {
  static get decimalPlaces() {
    return 12;
  }

  static fromRaw(amount) {
    return new ChainGreenAmount(new BigNumber(amount).shiftedBy(-ChainGreenAmount.decimalPlaces));
  }

  constructor(amount) {
    this.amountBN = new BigNumber(amount);
  }

  toString() {
    return this.amountBN.toString();
  }
}

module.exports = ChainGreenAmount;
