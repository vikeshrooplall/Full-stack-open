const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  { title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7 },
  { title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'https://reactpatterns.com/', likes: 5 }
]

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

test('Unique identifier of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  const firstBlog = response.body[0]
  assert(firstBlog.id !== undefined)
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

   const response = await api
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

after(async () => {
  await mongoose.connection.close()
})
