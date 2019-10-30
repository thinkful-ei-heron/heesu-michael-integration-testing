const expect = require('chai').expect;
const sort = require('../sort');

describe('Sort function', () => {
  it('should work with single element arrays', () => {
    expect(sort([1])).to.deep.equal([1]);
  });
  it('should work with the null array', () => {
    expect(sort([])).to.deep.equal([]);
  });
  it('should work with short arrays', () => {
    expect(sort([2, 1])).to.deep.equal([1, 2]);
  });
});
