const { RESTDataSource } = require('apollo-datasource-rest')
const { cancelaMatricula } = require('../../matricula/datasource/matricula')
const cacelaMatricula = require('../../matricula/datasource/matricula').cancelaMatricula.bind(cancelaMatricula)
class UsersAPI extends RESTDataSource {
  constructor(){
    super()
    this.baseURL = 'http://localhost:3000'
    this.respostaCustom = {
      code: 201,
      mensagem: "operação feita com sucesso"
    }
  }

  async getUsers({page = 1, limit = 0}) {
    const query = limit 
      ? `/users?_page=${page}&_limit=${limit}`
      : `/users?_page=${page}`
    const users = await this.get(query)
    return users
  }

  async getUserById(id) {
    const user = await this.get(`/users/${id}`)
    user.role = await this.get(`/roles/${user.role}`)
    return user
  }

  async adicionaUser(user) {
    const users = await this.get('/users')
    user.id = users.length + 1
    const role = await this.get(`roles?type=${user.role}`)
    await this.post('users', {...user, role: role[0].id})
    return ({
      ...user,
      role: role[0]
    })
  }

  async atualizaUser(novosDados) {
    const role = await this.get(`roles?type=${novosDados.user.role}`)
    await this.put(`users/${novosDados.id}`, {...novosDados.user, role: role[0].id })
    return ({
      ...this.respostaCustom,
      userAtualizado: {
        ...novosDados.user,
        role: role[0]
      }
    })
  }

  async deletaUser(id) {
    await this.delete(`users/${id}`)
    return this.respostaCustom
  }

  async mudaEstadoUser(id) {
    const user = await this.getUserById(id)
    if(user.ativo === false) {
      this.respostaCustom.mensagem = "usuário já cancelado"
      return this.respostaCustom
    }
    user.ativo = false
    await this.put(`/users/${id}`, {
      ...user
    })
    cacelaMatricula(id)
    this.respostaCustom.mensagem = `Usuário de id ${id} cancelado`
    return this.respostaCustom
  }
}

module.exports = UsersAPI