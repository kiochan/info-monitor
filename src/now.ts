const now: () => number = (performance) ?
  performance.now.bind(performance) :
  Date.now.bind(Date)

export default now
