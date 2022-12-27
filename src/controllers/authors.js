const express = require('express')
const { fn, col } = require('sequelize')
const { Blog } = require('../models')
const router = express.Router()

// GET, list all authors with number of articles and sum of all likes
router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [fn('COUNT', col('title')), 'articles'],
      [fn('SUM', col('likes')), 'likes'],
    ],
    order: [['likes', 'DESC']],
  })

  res.json(authors)
})

module.exports = router
