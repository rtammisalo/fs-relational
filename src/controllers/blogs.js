const express = require('express')
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { sessionChecker } = require('../middleware')
const { AuthorizationError } = require('../utils/errors')
const router = express.Router()

// GET, list all blogs
router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    const query = {
      [Op.iLike]: `%${req.query.search}%`,
    }

    where = {
      [Op.or]: [
        {
          title: query,
        },
        {
          author: query,
        },
      ],
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  })

  res.json(blogs)
})

// POST, create a new blog
router.post('/', sessionChecker, async (req, res) => {
  const blog = Blog.build({ ...req.body, userId: req.user.id })
  await blog.save()
  res.json(blog)
})

// BlogFinder middleware for single blog searches by id.
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findOne({
    where: { id: req.params.id },
    include: {
      model: User,
      attributes: ['name'],
    },
  })
  next()
}

// GET, return blog details by id
router.get('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    next(new ReferenceError(`No blog data available for id ${req.params.id}.`))
  }
})

// PUT, update blog likes by id
router.put('/:id', sessionChecker, blogFinder, async (req, res, next) => {
  if (req.blog) {
    if (req.user.id !== req.blog.userId) {
      throw new AuthorizationError(
        'cannot update the likes of a blog added by others'
      )
    }
    if (Number.isInteger(req.body.likes)) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)
    } else {
      next(
        new TypeError(
          'Request body data does not contain correctly formatted "likes".'
        )
      )
    }
  } else {
    next(
      new ReferenceError(
        `Cannot update likes for non-existing blog with id ${req.params.id}.`
      )
    )
  }
})

// DELETE, delete a blog by id
router.delete('/:id', sessionChecker, blogFinder, async (req, res, next) => {
  const blog = req.blog

  if (blog) {
    if (req.user.id === blog.userId) {
      await blog.destroy()
      res.json(blog)
    } else {
      next(new AuthorizationError('Unauthorized blog deletion'))
    }
  } else {
    next(
      new ReferenceError(
        `Cannot delete non-existing blog with id ${req.params.id}.`
      )
    )
  }
})

module.exports = router
