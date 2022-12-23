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

  try {
    await blog.save()
    res.json(blog)
  } catch (error) {
    res.status(400).end()
  }
})

// BlogFinder middleware for single blog searches by id.
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

// GET, return blog details by id
router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

// PUT, update blog likes by id
router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    if (Number.isInteger(req.body.likes)) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)
    } else {
      res.status(400).end()
    }
  } else {
    res.status(404).end()
  }
})

// DELETE, delete a blog by id
router.delete('/:id', blogFinder, async (req, res) => {
  const blog = req.blog

  if (blog) {
    await blog.destroy()
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router
