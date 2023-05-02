const express = require('express')
const pool = require('../config')
const router = express.Router()

// Get comment
router.get('/:blogId/comments', function (req, res, next) {})

// Create new comment
router.post('/:blogId/comments', async function (req, res, next) {
  const { comment, like, comment_by_id } = req.body
  const [row, field] = await pool.query(
    `INSERT INTO comments VALUES (null, ?, "?", ?, CURRENT_TIMESTAMP, ?)`,
    [req.params.blogId, comment, like, comment_by_id]
  )
  res.json({
    message: `A new comment is added (ID: ${row.insertId})`, // แสดง ID ของ comment ที่เพิ่งถูก add
  })
})

// Update comment
router.put('/comments/:commentId', async function (req, res, next) {
  const { comment, like, comment_date, comment_by_id, blog_id } = req.body
  const [row, field] = await pool.query(
    'UPDATE comments SET comments.comment = ?, comments.like = ?, comments.comment_date = ?, comments.comment_by_id = ?, comments.blog_id = ? WHERE comments.id = ?',
    [comment, like, comment_date, comment_by_id, blog_id, req.params.commentId]
  )

  res.json({
    message: `Comment ID ${req.params.commentId} is updated.`,
    comment: req.body,
  })
})

// Delete comment
router.delete('/comments/:commentId', async function (req, res, next) {
  const [row, field] = await pool.query(
    'DELETE FROM comments WHERE id = ?',
    [req.params.commentId]
  )
  res.json({
    message: `Comment ID ${req.params.commentId} is deleted.`,
  })
})

// 
router.put('/comments/addlike/:commentId', async function (req, res, next) {
  try {
    const [rows, fields] = await pool.query(
      'SELECT * FROM comments WHERE id=?',
      [req.params.commentId]
    )
    //ข้อมูล blog ที่เลือกจะอยู่ในตัวแปร rows
    
    
    console.log('Selected blogs =', rows)
    //สร้างตัวแปรมาเก็บจำนวน like ณ ปัจจุบันของ blog ที่ select มา
    const blogId = rows[0].blog_id
    let likeNum = rows[0].like
    console.log('Like num =', likeNum) // console.log() จำนวน Like ออกมาดู
    //เพิ่มจำนวน like ไปอีก 1 ครั้ง
    likeNum += 1
    
    //Update จำนวน Like กลับเข้าไปใน DB
    const [rows2, fields2] = await pool.query(
      'UPDATE comments SET comments.like=? WHERE comments.id=?',
      [likeNum, req.params.commentId]
    )
    res.json({
      blogId,
      commentId: req.params.commentId,
      likeNum: likeNum,
    })
  } catch (err) {
    return next(err)
  }
})

exports.router = router

// 'like, comment_by_id) VALUES (1, "new comment", 0, null)' at line 1
