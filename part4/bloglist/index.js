const express = require('express')
const mongoose = require('mongoose')

const app = express()

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit()
}

const password = process.argv[2]

const mongoUrl = `mongodb+srv://bloglist:${password}@cluster0.hpwm5ql.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)

mongoose.connect(mongoUrl, { family: 4 })

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

if (process.argv.length >=6) {
  const title = process.argv[3]
  const author = process.argv[4]
  const url = process.argv[5]
  const likes = process.argv[6]

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
  })

  blog.save().then(result => {
    console.log('blog saved')
    mongoose.connection.close()
  })
}



app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
