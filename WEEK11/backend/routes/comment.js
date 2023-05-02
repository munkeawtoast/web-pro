const express = require('express')
const path = require('path')
const multer = require('multer')
const pool = require('../config')
const fs = require('fs')
const router = express.Router()

// Require multer for file upload
// SET STORAGE

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const myPath = './static/uploads'
    if (!fs.existsSync(myPath)) {
      fs.mkdirSync(myPath)
    }
    callback(null, myPath)
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  },
})

const upload = multer({ storage: storage })

// Get comment
router.get('/:blogId/comments', function (req, res, next) {})

// Create new comment
router.post(
  '/:blogId/comments',
  upload.single('myImage'),
  async function (req, res, next) {
    const file = req.file

    console.log(req.body)

    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    const { comment } = req.body

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
      let results = await conn.query(
        'INSERT INTO comments(blog_id, comment, `like`,comment_date) VALUES(?, ?, 0, CURRENT_TIMESTAMP);',
        [req.params.blogId, comment]
      )

      console.log(results)

      const commentId = results[0].insertId

      await conn.query(
        'INSERT INTO images(blog_id, file_path, main, comment_id) VALUES(?, ?, 1, ?);',
        [-1, file.path.substr(6), commentId]
      )

      await conn.commit()
      res.send('success!')
    } catch (err) {
      await conn.rollback()
      next(err)
    } finally {
      console.log('finally')
      conn.release()
    }
  }
)

// Update comment
router.put('/comments/:commentId', function (req, res, next) {
  return
})

// Delete comment
router.delete('/comments/:commentId', function (req, res, next) {
  return
})

// Delete comment
router.put('/comments/addlike/:commentId', function (req, res, next) {
  return
})

exports.router = router
