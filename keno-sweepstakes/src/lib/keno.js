export class KenoGame {
    constructor(maxNumbers = 80, numbersToChoose = 10, drawCount = 20) {
      this.maxNumbers = maxNumbers;
      this.numbersToChoose = numbersToChoose;
      this.drawCount = drawCount;
    }
  
    generateNumbers() {
      const numbers = new Set();
      while (numbers.size < this.drawCount) {
        numbers.add(Math.floor(Math.random() * this.maxNumbers) + 1);
      }
      return Array.from(numbers).sort((a, b) => a - b);
    }
  
    // @ts-ignore
    calculateWinnings(playerNumbers, drawnNumbers) {
      // @ts-ignore
      const matches = playerNumbers.filter(num => drawnNumbers.includes(num)).length;
      const payouts = [0, 0, 1, 2, 5, 10, 50, 500, 10000, 100000, 1000000];
      return payouts[matches] || 0;
    }
  }
  
  // @ts-ignore
  export function generateSweepstakesCoins(amount) {
    return Math.floor(Math.random() * amount) + 1;
  }