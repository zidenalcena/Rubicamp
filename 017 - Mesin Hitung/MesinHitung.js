class MesinHitung {
  // write code here
  constructor() {
    this.x = 1;
  }

  add(num) {
    this.x += num;
    return this;
  }
  
  substract(num) {
    this.x -= num;
    return this;
  }
  
  divide(num) {
    this.x = Math.round(this.x /= num);
    return this;
  }
  
  multiply(num) {
    this.x = Math.round(this.x *= num);
    return this;
  }

  squareRoot() {
    this.x = Math.sqrt(this.x, 2);
    return this;
  }

  square() {
    this.x **= 2;
    return this;
  }
  
  exponent(num) {
    this.x **= num;
    return this;
  }

  result() {
    console.log(this.x);
  }
}

export default MesinHitung;

// for chainingable, we must to return this, not this.x.
