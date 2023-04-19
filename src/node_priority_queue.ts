import { FillNode } from './fill_node'
import { NodeBasePos } from './node_base_pos';
import { DescPriorityQueueBase, ChangeableDescPriorityQueueBase } from './desc_priority_queue_base';
import { IdGivenObject } from './id_given_object';

class NodeContainerByNodeBasePos extends DescPriorityQueueBase<FillNode> implements IdGivenObject {
  static id_counter = 0;
  id: number;
  base: NodeBasePos;
  nodeHeap: Array<[number, FillNode]> = [];

  constructor(base: NodeBasePos) {
    super();
    this.base = base;
    this.id = ++NodeContainerByNodeBasePos.id_counter;
  }
  getId(): number {
    return this.id;
  }

  addFillNode(node: FillNode) {
    this.addItem(node);
  }
  popFillNode(): FillNode {
    return this.popItem();
  }
  getDescPriority(fillNode: FillNode): number {
    const dx = fillNode.x - fillNode.base.x;
    const dy = fillNode.y - fillNode.base.y;
    return dx*dx + dy*dy;
  }
}

export class NodePriorityQueue extends ChangeableDescPriorityQueueBase<NodeContainerByNodeBasePos> {
  containerDict:{ [key: number]: NodeContainerByNodeBasePos } = {};
  popFillNode(): FillNode {
    const container = this.getTopItem();
    if(container.getLength() > 1) {
      const fillNode = container.popFillNode();
      this.updateDescPriority(container);
      return fillNode;
    } else {
      this.popItem();
      const fillNode = container.popFillNode();
      delete this.containerDict[fillNode.base.id];
      return fillNode;
    }
  }
  addFillNode(fillNode: FillNode): void {
    const baseId = fillNode.base.id;
    if(!(baseId in this.containerDict)) {
      const container = new NodeContainerByNodeBasePos(fillNode.base);
      this.containerDict[baseId] = container;
      container.addFillNode(fillNode);
      this.addItem(this.containerDict[baseId]);
    } else {
      const container = this.containerDict[baseId];
      container.addFillNode(fillNode);
      this.updateDescPriority(container);
    }
  }
  getDescPriority(nodeContainer: NodeContainerByNodeBasePos): number {
    const fillNode = nodeContainer.getTopItem();
    return this.getFullDistanceOfFillNode(fillNode);
  }
  getFullDistanceOfFillNode(fillNode: FillNode) {
    const dx = fillNode.x - fillNode.base.x;
    const dy = fillNode.y - fillNode.base.y;
    const baseDistance = fillNode.base.distance;
    return baseDistance + Math.sqrt( dx*dx + dy*dy );
  }
  getTopDistance():number {
    return this.getTopDescPriority();
  }
}
