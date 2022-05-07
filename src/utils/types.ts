export type Node = {
  id: number;
  x: number;
  y: number;
};

export type Link = {
  source: number;
  target: number;
};

export type Dot = {
  id: number;
  source: number;
  target: number;
  row: number;
};
