export type Node = {
  id: number;
  x: number;
  y: number;
  text: string;
};

export type Link = {
  id: number;
  source: number;
  target: number;
  bendPoints: Array<[number, number]>;
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

export interface Dataset {
  nodes: Array<Node>;
  links: Array<Link>;
  dots: Array<Dot>;
  dotsLinks: Array<Link>;
}

export interface State {
  svg: any;
  dataset: Dataset;
  link: Link;
  node: Node;
  dot: Dot;
  dotLinks: Link;
  selectedNode: number | null;
  selectedTargetNodes: Array<number>;
  selectedLink: number | null;
  selectedDot: number | null;
}
