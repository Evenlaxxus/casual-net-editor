export const graph1 = [
  {
    id: 0,
    name: 'start',
    incoming: [[3]],
    outgoing: [[1, 2], [4]],
  },
  {
    id: 1,
    name: 'begin',
    incoming: [[0]],
    outgoing: [[3]],
  },
  {
    id: 2,
    name: 'begin 2',
    incoming: [[0]],
    outgoing: [[3]],
  },
  {
    id: 3,
    name: 'finalize',
    incoming: [[1], [2]],
    outgoing: [[0], [4]],
  },
  {
    id: 4,
    name: 'end',
    incoming: [[0], [3]],
    outgoing: [],
  },
];

export const graph2 = [
  {
    id: 0,
    name: 'a',
    incoming: [],
    outgoing: [
      [1, 3],
      [2, 3],
    ],
  },
  {
    id: 1,
    name: 'b',
    incoming: [[0], [5]],
    outgoing: [[4]],
  },
  {
    id: 2,
    name: 'c',
    incoming: [[0], [5]],
    outgoing: [[4]],
  },
  {
    id: 3,
    name: 'd',
    incoming: [[0], [5]],
    outgoing: [[4]],
  },
  {
    id: 4,
    name: 'e',
    incoming: [
      [1, 3],
      [2, 3],
    ],
    outgoing: [[5], [6], [7]],
  },
  {
    id: 5,
    name: 'f',
    incoming: [[4]],
    outgoing: [
      [1, 3],
      [2, 3],
    ],
  },
  {
    id: 6,
    name: 'g',
    incoming: [[4]],
    outgoing: [[8]],
  },
  {
    id: 7,
    name: 'h',
    incoming: [[4]],
    outgoing: [[8]],
  },
  {
    id: 8,
    name: 'z',
    incoming: [[6, 7]],
    outgoing: [],
  },
];

export const graph3 = [
  {
    id: 0,
    name: 'a',
    incoming: [],
    outgoing: [[1]],
  },
  {
    id: 1,
    name: 'b',
    incoming: [[0], [1]],
    outgoing: [
      [2, 3],
      [1, 2],
    ],
  },
  {
    id: 2,
    name: 'c',
    incoming: [[1]],
    outgoing: [[4]],
  },
  {
    id: 3,
    name: 'd',
    incoming: [
      [1, 2],
      [2, 3],
    ],
    outgoing: [[3], [4]],
  },
  {
    id: 4,
    name: 'e',
    incoming: [[3]],
    outgoing: [],
  },
];

export const ANDgraph = [
  {
    id: 0,
    name: 'a',
    incoming: [],
    outgoing: [[1, 2]],
  },
  {
    id: 1,
    name: 'b',
    incoming: [[0]],
    outgoing: [[3]],
  },
  {
    id: 2,
    name: 'c',
    incoming: [[0]],
    outgoing: [[3]],
  },
  {
    id: 3,
    name: 'd',
    incoming: [[1, 2]],
    outgoing: [],
  },
];

export const ORgraph = [
  {
    id: 0,
    name: 'a',
    incoming: [],
    outgoing: [[1], [2], [1, 2]],
  },
  {
    id: 1,
    name: 'b',
    incoming: [[0]],
    outgoing: [[3]],
  },
  {
    id: 2,
    name: 'c',
    incoming: [[0]],
    outgoing: [[3]],
  },
  {
    id: 3,
    name: 'd',
    incoming: [[1], [2], [1, 2]],
    outgoing: [],
  },
];

export const XORgraph = [
  {
    id: 0,
    name: 'a',
    incoming: [],
    outgoing: [[1], [2]],
  },
  {
    id: 1,
    name: 'b',
    incoming: [[0]],
    outgoing: [[3]],
  },
  {
    id: 2,
    name: 'c',
    incoming: [[0]],
    outgoing: [[3]],
  },
  {
    id: 3,
    name: 'd',
    incoming: [[1], [2]],
    outgoing: [],
  },
];

export const long = [
  {
    id: 0,
    name: 'a',
    incoming: [],
    outgoing: [[1]],
  },
  {
    id: 1,
    name: 'b',
    incoming: [[0]],
    outgoing: [[2]],
  },
  {
    id: 2,
    name: 'c',
    incoming: [[1]],
    outgoing: [[3]],
  },
  {
    id: 3,
    name: 'd',
    incoming: [[2]],
    outgoing: [[4]],
  },
  {
    id: 4,
    name: 'e',
    incoming: [[3]],
    outgoing: [[5]],
  },
  {
    id: 5,
    name: 'f',
    incoming: [[4]],
    outgoing: [[6]],
  },
  {
    id: 6,
    name: 'g',
    incoming: [[5]],
    outgoing: [],
  },
];

export const parallel = [
  {
    id: 0,
    name: 'a',
    incoming: [],
    outgoing: [[1], [2]],
  },
  {
    id: 1,
    name: 'b',
    incoming: [[0]],
    outgoing: [[3]],
  },
  {
    id: 2,
    name: 'c',
    incoming: [[0]],
    outgoing: [[4]],
  },
  {
    id: 3,
    name: 'd',
    incoming: [[1]],
    outgoing: [[5]],
  },
  {
    id: 4,
    name: 'e',
    incoming: [[2]],
    outgoing: [[6]],
  },
  {
    id: 5,
    name: 'f',
    incoming: [[3]],
    outgoing: [[7]],
  },
  {
    id: 6,
    name: 'g',
    incoming: [[4]],
    outgoing: [[7]],
  },
  {
    id: 7,
    name: 'i',
    incoming: [[5], [6]],
    outgoing: [],
  },
];
