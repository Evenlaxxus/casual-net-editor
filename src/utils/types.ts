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
