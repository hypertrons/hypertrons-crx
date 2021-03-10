export const developerCollabrationData = {
  nodes: [
    {
      name: 'testDeveloperLogin',      // user or repo name, unique
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
      source: 'testDeveloperLogin',
      target: 'developer2',
      weight: 2      // collaborative relationship
    },
    {
      source: 'testDeveloperLogin',
      target: 'developer3',
      weight: 4
    },
    {
      source: 'testDeveloperLogin',
      target: 'developer4',
      weight: 5
    },
    {
      source: 'testDeveloperLogin',
      target: 'developer5',
      weight: 8
    },
    {
      source: 'testDeveloperLogin',
      target: 'developer6',
      weight: 5
    },
    {
      source: 'testDeveloperLogin',
      target: 'developer7',
      weight: 6
    },
    {
      source: 'testDeveloperLogin',
      target: 'developer8',
      weight: 8
    },
    {
      source: 'testDeveloperLogin',
      target: 'developer9',
      weight: 4
    },
    {
      source: 'testDeveloperLogin',
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

export const projectData = {
  nodes: [
    {
      name: 'project1',      // user or repo name, unique
      value: 50           // activeness
    },
    {
      name: 'project2',
      value: 40
    },
    {
      name: 'project3',
      value: 30
    },
    {
      name: 'project4',
      value: 20
    },
    {
      name: 'project5',
      value: 30
    },
    {
      name: 'project6',
      value: 43
    },
    {
      name: 'project7',
      value: 32
    },
    {
      name: 'project8',
      value: 25
    },
    {
      name: 'project10',
      value: 13
    }
  ],
  edges: [
    {
      source: 'project1',
      target: 'projec2',
      weight: 2      // collaborative relationship
    },
    {
      source: 'project1',
      target: 'project3',
      weight: 4
    },
    {
      source: 'project1',
      target: 'project4',
      weight: 5
    },
    {
      source: 'project1',
      target: 'project5',
      weight: 6
    },
    {
      source: 'project1',
      target: 'project6',
      weight: 5
    },
    {
      source: 'project1',
      target: 'project7',
      weight: 2
    },
    {
      source: 'project1',
      target: 'project8',
      weight: 4
    },
    {
      source: 'project1',
      target: 'project9',
      weight: 4
    },
    {
      source: 'project1',
      target: 'project10',
      weight: 6
    },
    {
      source: 'project2',
      target: 'project3',
      weight: 2
    },
    {
      source: 'project2',
      target: 'project4',
      weight: 1
    },
    {
      source: 'project2',
      target: 'project5',
      weight: 2
    },
    {
      source: 'project2',
      target: 'project6',
      weight: 1
    },
    {
      source: 'project2',
      target: 'project7',
      weight: 2
    },
    {
      source: 'project2',
      target: 'project8',
      weight: 1
    },
    {
      source: 'project2',
      target: 'project9',
      weight: 2
    },
    {
      source: 'project2',
      target: 'project10',
      weight: 1
    },
    {
      source: 'project3',
      target: 'project4',
      weight: 1
    },
    {
      source: 'project3',
      target: 'project5',
      weight: 2
    },
    {
      source: 'project3',
      target: 'project6',
      weight: 1
    },
    {
      source: 'project3',
      target: 'project7',
      weight: 2
    },
    {
      source: 'project3',
      target: 'project8',
      weight: 1
    },
    {
      source: 'project3',
      target: 'project9',
      weight: 4
    },
    {
      source: 'project3',
      target: 'project10',
      weight: 1
    },
    {
      source: 'project4',
      target: 'project5',
      weight: 2
    },
    {
      source: 'project4',
      target: 'project6',
      weight: 6
    },
    {
      source: 'project4',
      target: 'project7',
      weight: 2
    },
    {
      source: 'project4',
      target: 'project8',
      weight: 1
    },
    {
      source: 'project4',
      target: 'project9',
      weight: 2
    },
    {
      source: 'project4',
      target: 'project10',
      weight: 4
    },
    {
      source: 'project5',
      target: 'project6',
      weight: 1
    },
    {
      source: 'project6',
      target: 'project7',
      weight: 2
    },
    {
      source: 'project6',
      target: 'project8',
      weight: 5
    },
    {
      source: 'project6',
      target: 'project9',
      weight: 2
    },
    {
      source: 'project6',
      target: 'project10',
      weight: 1
    },
    {
      source: 'project7',
      target: 'project8',
      weight: 1
    },
    {
      source: 'project7',
      target: 'project9',
      weight: 2
    },
    {
      source: 'project7',
      target: 'project10',
      weight: 1
    },
    {
      source: 'project8',
      target: 'project9',
      weight: 2
    },
    {
      source: 'project9',
      target: 'project10',
      weight: 1
    },
  ]
}
