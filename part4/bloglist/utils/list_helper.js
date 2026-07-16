const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((favorite, current) =>
    current.likes > favorite.likes ? current : favorite
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCount = blogs.reduce((account, blog) => {
    account[blog.author] = (account[blog.author] || 0) + 1
    return account
  }, {})

  let maxAuthor = null
  let maxCount = 0

  for (const [author, count] of Object.entries(authorCount)) {
    if (count > maxCount) {
      maxCount = count
      maxAuthor = author
    }
  }

  return maxAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikes = blogs.reduce((account, blog) => {
    account[blog.author] = (account[blog.author] || 0) + blog.likes
    return account
  }, {})

  let maxAuthor = null
  let maxLikes = 0

  for (const [author, likes] of Object.entries(authorLikes)) {
    if (likes > maxLikes) {

      maxAuthor = author
      maxLikes = likes
    }
  }
  return {
    maxAuthor,
    maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
