export const graph1 = [
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

export const graph2 = [
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

export const correctAggregations = {
  graph1: [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 5],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [2, 3],
    [2, 4],
    [2, 5],
    [3, 4],
    [3, 5],
    [4, 5],
    [4, 6],
    [4, 7],
    [6, 7],
    [6, 8],
    [7, 8],
    [0, 1, 2],
    [0, 1, 3],
    [0, 1, 4],
    [0, 1, 5],
    [0, 2, 3],
    [0, 2, 4],
    [0, 2, 5],
    [0, 3, 4],
    [0, 3, 5],
    [0, 4, 5],
    [1, 2, 3],
    [1, 2, 4],
    [1, 2, 5],
    [1, 3, 4],
    [1, 3, 5],
    [1, 4, 5],
    [1, 4, 6],
    [1, 4, 7],
    [2, 3, 4],
    [2, 3, 5],
    [2, 4, 5],
    [2, 4, 6],
    [2, 4, 7],
    [3, 4, 5],
    [3, 4, 6],
    [3, 4, 7],
    [4, 6, 8],
    [4, 6, 7],
    [4, 7, 8],
    [6, 7, 8],
    [0, 1, 2, 3],
    [0, 1, 2, 4],
    [0, 1, 2, 5],
    [0, 1, 3, 4],
    [0, 1, 3, 5],
    [0, 1, 4, 5],
    [0, 1, 4, 6],
    [0, 1, 4, 7],
    [0, 2, 3, 4],
    [0, 2, 3, 5],
    [0, 2, 4, 5],
    [0, 2, 4, 6],
    [0, 2, 4, 7],
    [0, 3, 4, 5],
    [0, 3, 4, 6],
    [0, 3, 4, 7],
    [0, 4, 5, 6],
    [0, 4, 5, 7],
    [1, 2, 3, 4],
    [1, 2, 3, 5],
    [1, 2, 4, 5],
    [1, 2, 4, 6],
    [1, 2, 4, 7],
    [1, 3, 4, 5],
    [1, 3, 4, 6],
    [1, 3, 4, 7],
    [1, 4, 5, 6],
    [1, 4, 5, 7],
    [1, 4, 6, 7],
    [1, 4, 6, 8],
    [1, 4, 7, 8],
    [2, 3, 4, 5],
    [2, 3, 4, 6],
    [2, 3, 4, 7],
    [2, 4, 5, 6],
    [2, 4, 5, 7],
    [2, 4, 6, 7],
    [2, 4, 6, 8],
    [2, 4, 7, 8],
    [3, 4, 5, 6],
    [3, 4, 5, 7],
    [3, 4, 6, 7],
    [3, 4, 6, 8],
    [3, 4, 7, 8],
    [4, 5, 6, 7],
    [4, 5, 6, 8],
    [4, 5, 7, 8],
    [4, 6, 7, 8],
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 5],
    [0, 1, 2, 4, 5],
    [0, 1, 2, 4, 6],
    [0, 1, 2, 4, 7],
    [0, 1, 3, 4, 5],
    [0, 1, 3, 4, 6],
    [0, 1, 3, 4, 7],
    [0, 1, 4, 5, 6],
    [0, 1, 4, 5, 7],
    [0, 1, 4, 6, 7],
    [0, 1, 4, 6, 8],
    [0, 1, 4, 7, 8],
    [0, 2, 3, 4, 5],
    [0, 2, 3, 4, 6],
    [0, 2, 3, 4, 7],
    [0, 2, 4, 5, 6],
    [0, 2, 4, 5, 7],
    [0, 2, 4, 6, 7],
    [0, 2, 4, 6, 8],
    [0, 2, 4, 7, 8],
    [0, 3, 4, 5, 6],
    [0, 3, 4, 5, 7],
    [0, 3, 4, 6, 7],
    [0, 3, 4, 6, 8],
    [0, 3, 4, 7, 8],
    [0, 4, 5, 6, 7],
    [0, 4, 5, 6, 8],
    [0, 4, 5, 7, 8],
    [0, 4, 6, 7, 8],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 6],
    [1, 2, 3, 4, 7],
    [1, 2, 4, 5, 6],
    [1, 2, 4, 5, 7],
    [1, 2, 4, 6, 7],
    [1, 2, 4, 6, 8],
    [1, 2, 4, 7, 8],
    [1, 3, 4, 5, 6],
    [1, 3, 4, 5, 7],
    [1, 3, 4, 6, 7],
    [1, 3, 4, 6, 8],
    [1, 3, 4, 7, 8],
    [1, 4, 5, 6, 7],
    [1, 4, 5, 6, 8],
    [1, 4, 5, 7, 8],
    [1, 4, 6, 7, 8],
    [2, 3, 4, 5, 6],
    [2, 3, 4, 5, 7],
    [2, 3, 4, 6, 7],
    [2, 3, 4, 6, 8],
    [2, 3, 4, 7, 8],
    [2, 4, 5, 6, 7],
    [2, 4, 5, 6, 8],
    [2, 4, 5, 7, 8],
    [2, 4, 6, 7, 8],
    [3, 4, 5, 6, 7],
    [3, 4, 5, 6, 8],
    [3, 4, 5, 7, 8],
    [3, 4, 6, 7, 8],
    [4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5],
    [0, 1, 2, 3, 4, 6],
    [0, 1, 2, 3, 4, 7],
    [0, 1, 2, 4, 5, 6],
    [0, 1, 2, 4, 5, 7],
    [0, 1, 2, 4, 6, 7],
    [0, 1, 2, 4, 6, 8],
    [0, 1, 2, 4, 7, 8],
    [0, 1, 3, 4, 5, 6],
    [0, 1, 3, 4, 5, 7],
    [0, 1, 3, 4, 6, 7],
    [0, 1, 3, 4, 6, 8],
    [0, 1, 3, 4, 7, 8],
    [0, 1, 4, 5, 6, 7],
    [0, 1, 4, 5, 6, 8],
    [0, 1, 4, 5, 7, 8],
    [0, 1, 4, 6, 7, 8],
    [0, 2, 3, 4, 5, 6],
    [0, 2, 3, 4, 5, 7],
    [0, 2, 3, 4, 6, 7],
    [0, 2, 3, 4, 6, 8],
    [0, 2, 3, 4, 7, 8],
    [0, 2, 4, 5, 6, 7],
    [0, 2, 4, 5, 6, 8],
    [0, 2, 4, 5, 7, 8],
    [0, 2, 4, 6, 7, 8],
    [0, 3, 4, 5, 6, 7],
    [0, 3, 4, 5, 6, 8],
    [0, 3, 4, 5, 7, 8],
    [0, 3, 4, 6, 7, 8],
    [0, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 7],
    [1, 2, 3, 4, 6, 7],
    [1, 2, 3, 4, 6, 8],
    [1, 2, 3, 4, 7, 8],
    [1, 2, 4, 5, 6, 7],
    [1, 2, 4, 5, 6, 8],
    [1, 2, 4, 5, 7, 8],
    [1, 2, 4, 6, 7, 8],
    [1, 3, 4, 5, 6, 7],
    [1, 3, 4, 5, 6, 8],
    [1, 3, 4, 5, 7, 8],
    [1, 3, 4, 6, 7, 8],
    [1, 4, 5, 6, 7, 8],
    [2, 3, 4, 5, 6, 7],
    [2, 3, 4, 5, 6, 8],
    [2, 3, 4, 5, 7, 8],
    [2, 3, 4, 6, 7, 8],
    [2, 4, 5, 6, 7, 8],
    [3, 4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5, 6],
    [0, 1, 2, 3, 4, 5, 7],
    [0, 1, 2, 3, 4, 6, 7],
    [0, 1, 2, 3, 4, 6, 8],
    [0, 1, 2, 3, 4, 7, 8],
    [0, 1, 2, 4, 5, 6, 7],
    [0, 1, 2, 4, 5, 6, 8],
    [0, 1, 2, 4, 5, 7, 8],
    [0, 1, 2, 4, 6, 7, 8],
    [0, 1, 3, 4, 5, 6, 7],
    [0, 1, 3, 4, 5, 6, 8],
    [0, 1, 3, 4, 5, 7, 8],
    [0, 1, 3, 4, 6, 7, 8],
    [0, 1, 4, 5, 6, 7, 8],
    [0, 2, 3, 4, 5, 6, 7],
    [0, 2, 3, 4, 5, 6, 8],
    [0, 2, 3, 4, 5, 7, 8],
    [0, 2, 3, 4, 6, 7, 8],
    [0, 2, 4, 5, 6, 7, 8],
    [0, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7],
    [1, 2, 3, 4, 5, 6, 8],
    [1, 2, 3, 4, 5, 7, 8],
    [1, 2, 3, 4, 6, 7, 8],
    [1, 2, 4, 5, 6, 7, 8],
    [1, 3, 4, 5, 6, 7, 8],
    [2, 3, 4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 8],
    [0, 1, 2, 3, 4, 5, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
  ],
  graph2: [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
    [0, 1, 2],
    [0, 1, 3],
    [0, 1, 4],
    [0, 2, 3],
    [0, 2, 4],
    [0, 3, 4],
    [1, 2, 3],
    [1, 2, 4],
    [1, 3, 4],
    [2, 3, 4],
    [0, 1, 2, 3],
    [0, 1, 2, 4],
    [0, 1, 3, 4],
    [0, 2, 3, 4],
    [1, 2, 3, 4],
    [0, 1, 2, 3, 4],
  ],
};
