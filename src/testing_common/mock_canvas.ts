import { CanvasFillInterface } from '../stepping_fill'

export class MockCanvas implements CanvasFillInterface {
  data: Array< Array<string> >;
  expected: Array< Array<string> >;
  width: number;
  height: number;
  currentNumber: number = 0;
  constructor(initialWallMap: Array<string>, expectedMap: Array<string>) {
    this.data = initialWallMap.map((s) => s.replace(/ /g, "").split(""));
    this.expected = expectedMap.map((s) => s.replace(/ /g, "").split(""));
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
      if(this.currentNumber < expectedNumber) {
        this.currentNumber = expectedNumber;
      }
      this.data[y][x] = `${this.currentNumber}`;
    } else {
      this.data[y][x] = "*";
    }
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
  getCurrentDataAsString(): string {
    return this.data.map((line) => line.join(" ")).join("\n");
  }
  getExpectedAsString(): string {
    return this.expected.map((line) => line.join(" ")).join("\n");
  }
}