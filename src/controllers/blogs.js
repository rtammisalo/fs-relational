const express = require('express')
const { Blog } = require('../models')
const router = express.Router()

// GET, list all blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

// POST, create a new blog
router.post('/', async (req, res) => {
  const blog = Blog.build(req.body)
  await blog.save()
  res.json(blog)
})

// BlogFinder middleware for single blog searches by id.
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
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
router.put('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
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
router.delete('/:id', blogFinder, async (req, res, next) => {
  const blog = req.blog

  if (blog) {
    await blog.destroy()
    res.json(blog)
  } else {
    next(
      new ReferenceError(
        `Cannot delete non-existing blog with id ${req.params.id}.`
      )
    )
  }
})

module.exports = router
