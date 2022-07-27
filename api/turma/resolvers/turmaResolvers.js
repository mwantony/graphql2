const turmaResolvers = {
  Query: {
    turmas: (root, args, {dataSources}, info) => dataSources.turmasAPI.getTurmas() 
  }
}

module.exports = turmaResolvers