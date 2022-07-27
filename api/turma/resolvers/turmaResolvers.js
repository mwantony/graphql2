const { GraphQLScalarType } = require("graphql");
const turmaResolvers = {
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "string de data e hora no formato ISO-8601",
    serialize: (value) => new Date(value).toISOString(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => new Date(ast.value).toISOString(),
  }),
  Query: {
    turmas: (root, args, { dataSources }, info) =>
      dataSources.turmasAPI.getTurmas(args),
    turma: (root, { id }, { dataSources }, info) =>
      dataSources.turmasAPI.getTurma(id),
  },
  Mutation: {
    incluiTurma: (root, { turma }, { dataSources }) =>
      dataSources.turmasAPI.incluiTurma(turma),
    atualizaTurma: (root, dados, { dataSources }) =>
      dataSources.turmasAPI.atualizaTurma(dados),
    deletaTurma: (root, { id }, { dataSources }) =>
      dataSources.turmasAPI.deletaTurma(id),
  },

  Turma: {
    matriculas: (parent, args, { dataSources }) =>
      dataSources.matriculasAPI.getMatriculasPorTurma(parent.id),
    docente: (parent, args, {dataSources}) => dataSources.usersAPI.getUserById(parent.docente_id)
  },
}

module.exports = turmaResolvers;
