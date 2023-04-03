import { SteppingFillProcessor } from './stepping_fill'
import { NodeBasePos } from './node_base_pos'

export class FillNode {
  fillProcessor: SteppingFillProcessor;
  x: number;
  y: number;
  dx: number;
  dy: number;
  base: NodeBasePos;

  constructor(
    fillProcessor: SteppingFillProcessor,
    x:number,
    y:number,
    dx:number,
    dy:number,
    base:NodeBasePos,
    ) {
    this.fillProcessor = fillProcessor;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.base = base;
  }

  proceed(): boolean {
    if(this.fillProcessor.isWall(this.x, this.y)) return false;
    this.fillProcessor.fill(this.x, this.y);
    this.y += this.dy;
    return true;
  }
}