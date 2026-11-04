const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  { title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7 },
  { title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5 }
]

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Blog list returns the correct amount of blog posts', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('Unique identifier of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    const firstBlog = response.body[0]
    assert(firstBlog.id !== undefined)
  })

  describe('addition of a new blog', () => {
    test('A valid blog can be added', async () => {
      const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'Vikesh Rooplall',
        url: 'https://fullstackopen.com/en/part4',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await Blog.find({})
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes(newBlog.title))
    })

    test('If likes property is missing, default likes value will be 0', async () => {
      const newBlog = {
      title: 'Defaulting likes to 0',
      author: 'FullStackOpen',
      url: 'https://fullstackopen.com/en/part4'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      const savedBlog = await Blog.findOne({ title: newBlog.title})
      assert.strictEqual(savedBlog.likes, 0)
    })

    test('A blog without a title is rejected with 400', async () => {
      const newBlog = {
        author: 'Vikesh Rooplall',
        url: 'https://fullstackopen.com/en/part4',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await Blog.find({})
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })

    test('A blog without a url is rejected with 400', async () => {
        const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'Vikesh Rooplall',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await Blog.find({})
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('deletion of a blog succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await api.get('/api/blogs')
      const blogToDelete = blogsAtStart.body[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await api.get('/api/blogs')

      const ids = blogsAtEnd.body.map(n => n.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
    })
  })

  describe('updating a blog', () => {
    test('Updating the likes of a blog returns 200', async () => {
      const blogs = await api.get('/api/blogs')
      const blogToUpdate = blogs.body[0]

      const newLikes = blogToUpdate.likes + 1

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: newLikes })
        .expect(200)

      assert.strictEqual(response.body.likes, newLikes)

      const blogsAtEnd = await api.get('/api/blogs')

      const updatedBlog = blogsAtEnd.body.find(b => b.id === blogToUpdate.id)

      assert.strictEqual(updatedBlog.likes, newLikes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
