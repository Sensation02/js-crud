// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
// Створюємо клас User, який буде відповідати за роботу з юзерами
class User {
  static #list = []
  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static addUser = (user) => {
    this.#list.push(user)
  }
  static getList = () => {
    return this.#list
  }
  static getById = (id) =>
    this.#list.findIndex((user) => user.id === id)

  static deleteUser = (id) => {
    const index = this.getById(id)
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateUserEmail = (id, data) => {
    const user = this.getById(id)
    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}
// ================================================================

router.get('/', function (req, res) {
  const list = User.getList()
  res.render('index', {
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body // деструктуризація об'єкта req.body
  // тобто це те що ми вводимо в форму (req - request, body - тіло запиту)

  const user = new User(email, login, password) // створюємо новий екземпляр класу User
  User.addUser(user) // додаємо нового юзера в масив

  res.render('success-info', {
    style: 'success-info',
    info: 'User was successfully added',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query
  User.deleteUser(+id)

  res.render('success-info', {
    style: 'success-info',
    info: 'User was deleted',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body
  let result = false
  const user = User.getById(+id)

  if (user.verifyPassword(password)) {
    result = User.update(user, { email })
  }

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Email was changed'
      : 'Email was not changed',
  })
})

// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
