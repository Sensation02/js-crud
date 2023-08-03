// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []
  static #count = 0
  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
      // прибираємо зі списку товар з вказаним id
    )

    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
      // перемішуємо список товарів
    )

    return shuffledList.slice(0, 3) // повертаємо перші 3 товари
  }
}

Product.add(
  'https://picsum.photos/800/800',
  "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600",
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [
    {
      id: 1,
      text: 'Shipping',
    },
    {
      id: 2,
      text: 'Top Sales',
    },
  ],
  27000,
  10,
)

Product.add(
  'https://picsum.photos/800/800',
  "Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel",
  'Intel Core i5 11400F (2.6 - 4.4 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 240 ГБ / nVidia GeForce RTX 3060, 12 ГБ / без ОД / LAN / без ОС',
  [
    {
      id: 1,
      text: 'Top Sales',
    },
  ],
  35000,
  10,
)

Product.add(
  'https://picsum.photos/800/800',
  "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/",
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [
    {
      id: 1,
      text: 'Shipping',
    },
  ],
  27000,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1
  static #count = 0
  static #list = []

  // Тут ми зберігаємо бонусні рахунки:
  static #bonusAccount = new Map()

  // Витягуємо бонусний рахунок по email:
  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (price) => {
    return price * Purchase.#BONUS_FACTOR
  }

  // Оновлюємо бонусний рахунок по email:
  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    // тут ми рахуємо ціну з урахуванням бонусів:
    const amount = Purchase.calcBonusAmount(price)
    // отримуємо поточний баланс:
    const currentBalance = Purchase.getBonusBalance(email)
    // оновлюємо баланс:
    const updateBalance = currentBalance + amount - bonusUse
    // оновлюємо бонусний рахунок:
    Purchase.#bonusAccount.set(email, updateBalance)

    console.log(email, updateBalance)
    // повертаємо оновлений баланс:
    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.name = data.name
    this.surname = data.surname
    this.phone = data.phone
    this.email = data.email
    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promo = data.promo || null

    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.totalPrice = data.totalPrice
    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }

  // Отримуємо список покупок:
  static getList = () => {
    return this.#list.reverse().map((purchase) => ({
      id: purchase.product.id,
      title: purchase.product.title,
      totalPrice: purchase.totalPrice,
      bonus: Purchase.calcBonusAmount(purchase.totalPrice),
    }))
  }

  static getById = (id) => {
    return this.#list.find((purchase) => purchase.id === id)
  }

  static updateById = (id, data) => {
    const purchase = this.getById(id)

    if (purchase) {
      if (data.name) purchase.name = data.name
      if (data.surname) purchase.surname = data.surname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email
      return true
    } else {
      return false
    }
  }
}

class Promo {
  // Тут ми зберігаємо список промокодів
  static #list = []

  // Конструктор промокоду в якого є назва та фактор знижки
  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  // Додаємо промокод в список
  static add = (name, factor) => {
    const newPromo = new Promo(name, factor)
    Promo.#list.push(newPromo)
    return newPromo
  }

  // Отримуємо промокод по назві
  static getByName = (name) => {
    return Promo.#list.find((promo) => promo.name === name)
  }

  // Обчислюємо ціну з урахуванням промокоду
  static calc = (promo, price) => {
    return price - price * promo.factor
  }
}

Promo.add('promo1', 0.1)
Promo.add('promo2', 0.2)
Promo.add('promo3', 0.3)
// ================================================================

// router.get('/', function (req, res) {
//   res.render('index', {
//     style: 'index',
//     data: {},
//   })
// })

// ================================================================

router.get('/purchase-alert', function (req, res) {
  res.render('purchase-alert', {
    style: 'purchase-alert',

    data: {
      message: 'Операція успішна',
      info: 'Товар створений',
      link: '/test-path',
    },
  })
})

// ================================================================

router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
})

// ================================================================

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-product', {
    style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})

// ================================================================

// Створюємо замовлення:
router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Кількість товару не може бути меншою за 1',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)
  if (product.amount < 1) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Товару немає в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} x ${amount} шт.`,
          price: productPrice,
        },
        {
          text: 'Доставка',
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})

// Підтверджуємо замовлення:
router.post('/purchase-submit', function (req, res) {
  const id = +req.query.id
  let {
    name,
    surname,
    phone,
    email,
    comment,

    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    promo,
    bonus,
  } = req.body

  // Перевіряємо чи є такий товар
  const product = Product.getById(id)

  // #region Checking data
  // Якщо товару немає, то виводимо помилку
  if (!product) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: '/purchase-list',
      },
    })
  }
  if (product.amount < 1) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Товару немає в наявності',
        link: '/purchase-list',
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  // Перевіряємо чи коректні дані
  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Невірні дані',
        link: `/purchase-list`,
      },
    })
  }

  // Перевіряємо чи заповнені всі необхідні поля
  if (!name || !surname || !phone || !email) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Заповніть всі поля',
        link: `/purchase-list`,
      },
    })
  }

  // Використання бонусів:
  if (bonus || bonus > 0) {
    // Отримуємо в перемінну баланс бонусів:
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    // Перевіряємо чи є достатньо бонусів:
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    // Оновлюємо баланс бонусів:
    Purchase.updateBonusBalance(email, totalPrice, bonus)

    // Застосовуємо бонуси:
    totalPrice -= bonus

    // Якщо бонусів не вистачило, чи їх не вказали:
  } else {
    // Оновлюємо баланс бонусів:
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  // Використовуємо промокод:
  if (promo) {
    // Шукаємо промокод в базі даних:
    promo = Promo.getByName(promo)
    // Якщо промокод знайдено, то використовуємо його:
    if (promo) {
      totalPrice = Promo.calc(promo, totalPrice)
    }
  }

  // Перевіряємо чи ціна товару не від'ємна, якщо так то встановлюємо її 0:
  if (totalPrice < 0) totalPrice = 0
  // #endregion

  // Створюємо замовлення:
  const purchase = Purchase.add(
    {
      name,
      surname,
      phone,
      email,
      comment,

      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      promo,
    },
    product,
  )

  console.log(purchase)

  res.render('purchase-alert', {
    style: 'purchase-alert',
    data: {
      message: 'Операція успішна',
      info: 'Замовлення створено',
      link: `/purchase-list`,
    },
  })
})

// ================================================================

// Список замовлень:
router.get('/purchase-list', function (req, res) {
  const purchases = Purchase.getList()

  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      list: purchases,
    },
  })
})

// ================================================================

router.get('/purchase-info', function (req, res) {
  const id = +req.query.id
  const purchase = Purchase.getById(id)

  console.log(purchase)

  res.render('purchase-info', {
    style: 'purchase-info',
    data: {
      id: purchase.id,
      name: purchase.name,
      surname: purchase.surname,
      phone: purchase.phone,
      email: purchase.email,
      product: purchase.product.title,
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      totalPrice: purchase.totalPrice,
      bonus: Purchase.getBonusBalance(purchase.email),
    },
  })
})

// ================================================================
router.get('/purchase-edit', function (req, res) {
  const id = +req.query.id
  const purchase = Purchase.getById(id)

  if (purchase) {
    res.render('purchase-edit', {
      style: 'purchase-edit',
      data: {
        id: purchase.id,
        name: purchase.name,
        surname: purchase.surname,
        phone: purchase.phone,
        email: purchase.email,
      },
    })
  } else {
    res.render('purchase-alert', {
      style: 'purchase-alert',
      message: 'Error',
      info: 'Data not found',
      link: `/purchase-info?id=${id}`,
    })
  }
})

router.post('/purchase-update', function (req, res) {
  const id = +req.query.id
  let { name, surname, phone, email } = req.body
  const purchase = Purchase.getById(id)

  console.log(purchase)

  if (purchase) {
    const newPurchase = Purchase.updateById(id, {
      name,
      surname,
      phone,
      email,
    })
    console.log(newPurchase)
    if (newPurchase) {
      res.render('purchase-alert', {
        style: 'purchase-alert',
        data: {
          message: 'Success',
          info: 'Data updated',
          link: '/purchase-list',
        },
      })
    } else {
      res.render('purchase-alert', {
        style: 'purchase-alert',
        data: {
          message: 'Error',
          info: 'Incorrect data',
          link: '/purchase-list',
        },
      })
    }
  } else {
    res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Error',
        info: 'Data not found',
        link: '/purchase-list',
      },
    })
  }
})
// ================================================================
module.exports = router
