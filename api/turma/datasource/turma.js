const { SQLDataSource } = require("datasource-sql");
const DataLoader = require("dataloader");
class TurmasAPI extends SQLDataSource {
  constructor(dbConfig) {
    super(dbConfig);
    this.Resposta = {
      mensagem: "",
    };
  }

  async getTurmas({page = 0, pageOffset = Infinity}) {
    const registroInicial = page === 0 || page === 1 ? 0 : (page * pageOffset) - 1
    return await this.db.select("*").from("turmas").offset(registroInicial).limit(pageOffset)
  }

  async getTurma(id) {
    const turma = await this.db
      .select("*")
      .from("turmas")
      .where({ id: Number(id) });
    return turma[0];
  }
  getTurmasCarregadas = new DataLoader(async (idsTurmas) => {
    const turmas = await this.db
      .select("*")
      .from("turmas")
      .whereIn("id", idsTurmas);

    return idsTurmas.map((id) => turmas.find((turma) => turma.id === id));
  });

  async incluiTurma(turma) {
    const novaTurma = await this.db
      .insert({ ...turma })
      .returning(turma.id)
      .into("turmas");
    const turmaInserida = await this.getTurma(novaTurma[0]);
    return { ...turmaInserida };
  }

  async atualizaTurma(dados) {
    await this.db
      .update({
        ...dados.turma,
      })
      .where({ id: Number(dados.id) })
      .into("turmas");
    const turmaAtualizada = await this.getTurma(dados.id);
    return {
      ...turmaAtualizada,
    };
  }

  async deletaTurma(id) {
    await this.db("turmas")
      .where({ id: Number(id) })
      .del();

    this.Resposta.mensagem = `registro de id ${id} deletado com sucesso`;

    return this.Resposta;
  }
}

module.exports = TurmasAPI;
