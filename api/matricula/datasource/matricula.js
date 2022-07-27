const { SQLDataSource } = require("datasource-sql");
const DataLoader = require('dataloader')

class MatriculasAPI extends SQLDataSource {
  constructor(dbConfig) {
    super(dbConfig)
    this.Resposta = {
      mensagem: ""
    }
  }

  async matricularEstudante(ids) {
    const novaMatricula = {
      estudante_id: ids.estudante,
      turma_id: ids.turma,
      status: "confirmado",
    }

    await this.db
      .insert(novaMatricula)
      .into('matriculas')
    this.Resposta.mensagem = 'matricula confirmada'
    return this.Resposta
  }

  async getMatriculasPorTurma(idTurma) {
    const matriculas = await this.db
      .select('*')
      .from('matriculas')
      .where({turma_id: Number(idTurma)})

    console.log(matriculas)
    return matriculas
  }

  matriculasLoader = new DataLoader(this.getMatriculasPorEstudante.bind(this))

  async getMatriculasPorEstudante(idEstudante) {
    const matriculas = await this.db
      .select('*')
      .from('matriculas')
      .whereIn('estudante_id', idEstudante)
      .select()

    return matriculas
  }
  async deletarMatricula(idMatricula) {
    await this.db('matriculas')
      .where({id: Number(idMatricula)})
      .del()
    this.Resposta.mensagem = `registro de id ${idMatricula} deletado com sucesso`
    return this.Resposta
  }

  async cancelarMatricula(idMatricula) {
    await this.db
      .update({status: "cancelado"})
      .where({id: Number(idMatricula)})
      .into('matriculas')

    this.Resposta.mensagem = 'matricula cancelada'
    return this.Resposta
  }
  static cancelaMatricula(id) {
    this.db
      .update({status: "cancelado"})
      .where({estudante_id: Number(id)})
  }
}

module.exports = MatriculasAPI