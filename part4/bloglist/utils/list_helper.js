const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favourite, blog) =>
    blog.likes > favourite.likes ? blog : favourite
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')

  const count = _.map(grouped, (authorBlogs, author) => ({
    author,
    blogs: authorBlogs.length
  }))

  const max = _.maxBy(count, 'blogs')

  return max
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')

  const summaries = _.map(grouped, (authorBlogs, author) => ({
    author,
    likes: _.sumBy(authorBlogs, 'likes')
  }))

  const max =_.maxBy(summaries, 'likes')

  return max
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
