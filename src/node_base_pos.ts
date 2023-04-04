export class NodeBasePos {
  x: number;
  y: number;
  distance: number;
  id: number;

  constructor(x:number, y:number, distance:number, id:number) {
    this.x = x;
    this.y = y;
    this.distance = distance;
    this.id = id;
  }
}

export class NodeBasePosFactory {
  nodeBasePosArray: Array<NodeBasePos> = [];

  createNodeBasePos(x:number, y:number, distance:number) {
    const newId = this.nodeBasePosArray.length;
    const newNodeBasePos = new NodeBasePos(x, y, distance, newId);
    this.nodeBasePosArray.push(newNodeBasePos);
    return newNodeBasePos;
  }
}