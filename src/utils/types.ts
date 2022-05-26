export type Node = {
  id: number;
  x: number;
  y: number;
};

export type Link = {
  id: number;
  source: number;
  target: number;
};

export type Dot = {
  id: number;
  source: number;
  target: number;
  row: number;
};

export interface HTMLInputEvent extends InputEvent {
  target: HTMLInputElement & EventTarget;
}

export interface State {
  svg: any;
  dataset: {
    nodes: Array<Node>;
    links: Array<Link>;
    dots: Array<Dot>;
    dotsLinks: Array<Link>;
  };
  link: any;
  node: any;
  dot: any;
  nodeIdText: any;
  dotLinks: any;
  selectedNode: number | null;
  selectedTargetNodes: Array<number>;
  selectedLink: number | null;
  selectedDot: number | null;
}
