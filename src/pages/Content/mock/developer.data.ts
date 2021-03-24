export const developerData = {
  nodes: [
    {
      name: 'torvalds',      // user or repo name, unique
      value: 50           // activeness
    },
    {
      name: 'developer2',
      value: 40
    },
    {
      name: 'developer3',
      value: 30
    },
    {
      name: 'developer4',
      value: 20
    },
    {
      name: 'developer5',
      value: 30
    },
    {
      name: 'developer6',
      value: 43
    },
    {
      name: 'developer7',
      value: 32
    },
    {
      name: 'developer8',
      value: 25
    },
    {
      name: 'developer9',
      value: 13
    }
  ],
  edges: [
    {
      source: 'torvalds',
      target: 'developer2',
      weight: 2      // collaborative relationship
    },
    {
      source: 'torvalds',
      target: 'developer3',
      weight: 4
    },
    {
      source: 'torvalds',
      target: 'developer4',
      weight: 5
    },
    {
      source: 'torvalds',
      target: 'developer5',
      weight: 8
    },
    {
      source: 'torvalds',
      target: 'developer6',
      weight: 5
    },
    {
      source: 'torvalds',
      target: 'developer7',
      weight: 6
    },
    {
      source: 'torvalds',
      target: 'developer8',
      weight: 8
    },
    {
      source: 'torvalds',
      target: 'developer9',
      weight: 4
    },
    {
      source: 'torvalds',
      target: 'developer5',
      weight: 8
    },
    {
      source: 'developer2',
      target: 'developer4',
      weight: 2
    },
    {
      source: 'developer3',
      target: 'developer9',
      weight: 1
    },
    {
      source: 'developer5',
      target: 'developer7',
      weight: 2
    },
    {
      source: 'developer4',
      target: 'developer8',
      weight: 1
    },
  ]
}
