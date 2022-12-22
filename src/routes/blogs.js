const express = require('express')
const Blog = require('../models/Blog')
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

// DELETE, delete a blog
router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (blog) {
    await blog.destroy()
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router
