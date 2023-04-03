import { CanvasFillInterface } from '../stepping_fill'

export class MockCanvas implements CanvasFillInterface {
  data: Array< Array<string> >;
  expected: Array< Array<string> >;
  width: number;
  height: number;
  currentNumber: number = 0;
  isReverseHappened: boolean = false;
  constructor(initialWallMap: Array<string>, expectedMap: Array<string>) {
    this.data = initialWallMap.map((s) => s.replace(" ", "").split(""));
    this.expected = expectedMap.map((s) => s.replace(" ", "").split(""));
    this.height = initialWallMap.length;
    this.width = Math.max(...this.data.map((line) => line.length));
  }
  getStartingXY():[number, number] {
    for(let y=0; y<this.data.length; y++) {
      for(let x=0; x<this.data[y].length; x++) {
        if(this.data[y][x] === 's') return [x,y];
      }
    }
    throw new Error("No starting mark 's'.");
  }
  fillPoint(x: number, y: number): void {
    if(this.expected[y][x].match(/[0-9]/)) {
      const expectedNumber = Number(this.expected[y][x]);
      if(this.currentNumber > expectedNumber) {
        this.isReverseHappened = true;
      }
      this.currentNumber = expectedNumber;
    }
    this.data[y][x] = "*";
  }
  getWidth(): number {
    return this.width;
  }
  getHeight(): number {
    return this.height;
  }
  isWall(x:number, y:number): boolean {
    if(x<0 || this.width <= x) return true;
    if(y<0 || this.height <= y) return true;
    return this.data[y][x] === "#";
  }
  checkResult(): boolean {
    if(this.isReverseHappened) return false;
    for(let y=0; y<this.expected.length; y++) {
      for(let x=0; x<this.expected[y].length; x++) {
        if(this.expected[y][x] === "#") {
          if(this.data[y][x] !== "#") return false;
        } else if(this.expected[y][x] === "-") {
          if(this.data[y][x] !== "-") return false;
        } else {
          if(this.data[y][x] !== "*") return false;
        }
      }
    }
    return true;
  };
}