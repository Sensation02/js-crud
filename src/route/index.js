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

class Product {
  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 100000)
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }
  static #list = []
  static getList = () => this.#list
  static add = (product) => this.#list.push(product)
  static getById = (id) =>
    this.#list.find((product) => product.id === id)
  static updateById = (id, data) => {
    const product = this.getById(id)
    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }
  static update = (name, { product }) => {
    if (name) {
      product.name = name
    }
  }
  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
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

router.get('/product-create', function (req, res) {
  const list = Product.getList()
  res.render('product-create', {
    style: 'product-create',
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

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)
  Product.add(product)

  if (Product.getById(product.id)) {
    result = true
  } else {
    result = false
  }

  res.render('alert', {
    style: 'alert',
    title: result
      ? 'Успішне виконання дії'
      : 'Не успішне виконання дії',
    info: result
      ? 'Товар успішно був доданий'
      : 'Товар не був доданий',
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

router.get('/product-list', function (req, res) {
  // отримуємо список товарів та виводимо їх на сторінку
  const list = Product.getList()
  console.log(list) // виводимо список товарів в консоль (для перевірки)
  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body
  let result = false
  const user = User.getById(+id)

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    return (result = true)
  }

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Email was changed'
      : 'Email was not changed',
  })
})

router.get('/product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(+id)
  if (product) {
    return res.render('product-edit', {
      style: 'product-edit',
      data: {
        name: product.name,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    return res.render('alert', {
      style: 'alert',
      title: 'Не успішне виконання дії',
      info: 'Товар не знайдено',
    })
  }
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body
  const product = Product.updateById(id, {
    name,
    price,
    description,
  })
  if (product) {
    res.render('alert', {
      style: 'alert',
      title: 'Успішне виконання дії',
      info: 'Інформація про товар оновлена',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      title: 'Не успішне виконання дії',
      info: 'Помилка при оновленні інформації про товар',
    })
  }
})

router.get('/product-delete', function (req, res) {
  const { id } = req.query
  Product.deleteById(+id)
  if (Product.getById(+id)) {
    result = false
  } else {
    result = true
  }
  res.render('alert', {
    style: 'alert',
    title: result
      ? 'Успішне виконання дії'
      : 'Не успішне виконання дії',
    info: result
      ? 'Товар успішно видалений'
      : 'Товар не був видалений',
  })
})
// Підключаємо роутер до бек-енду
module.exports = router
