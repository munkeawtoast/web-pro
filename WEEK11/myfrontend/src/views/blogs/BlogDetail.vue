<script>
import { defineComponent } from 'vue'
import axios from 'axios'
export default defineComponent({
  data: () => ({
    blogId: null,
    blog: {},
    comments: [],
    images: [],
    blogDetail: {},
    error: null,
    newComment: '',
    newImage: '',
  }),
  created() {
    this.blogId = this.$route.params.id
    axios.get('http://localhost:3000/blogs/' + this.blogId).then((res) => {
      console.log(res.data)
      const { blog, images, comments, error } = res.data
      console.log(res.data)
      this.blog = blog
      this.images = images
      this.comments = comments
      this.error = error
    })
  },
  methods: {
    handleFileUpload() {
      this.newImage = this.$refs.file.files[0]
    },
    submit() {
      var formData = new FormData()
      formData.append('myImage', this.newImage)
      formData.append('comment', this.newComment)
      axios
        .post(`http://localhost:3000/${this.blogId}/comments`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          // this.$router.push({ path: '/' }) // Success! -> redirect to home page
          location.reload()
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
  },
})
</script>

<template>
  <div class="container ias-widescreen">
    <section class="section" v-if="this.error">
      <div class="container is-widescreen">
        <div class="notification is-danger">
          {{ this.error.code + this.error.sqlMessage }}
        </div>
      </div>
    </section>
    <section class="hero" v-if="!this.error">
      <div class="hero-body">
        <p class="title">{{ this.blog.title }}</p>
      </div>
    </section>
    <section class="section" id="app">
      <div class="content">
        <div class="card has-background-light">
          <div class="card-image pt-5">
            <div class="columns">
              <div class="column" v-for="image in images" :key="image.id">
                <figure class="image">
                  <img
                    :src="'http://localhost:3000/' + image.file_path"
                    alt="Placeholder image"
                  />
                </figure>
              </div>
            </div>
          </div>
          <div class="card-content">
            <div class="content">{{ this.blog.content }}</div>
            <div class="container">
              <p class="subtitle">Comments</p>
              <div class="box" v-for="comment in comments" :key="comment.id">
                <article class="media">
                  <div class="media-left">
                    <figure class="image is-64x64">
                      <img
                        :src="
                          comment.file_path
                            ? 'http://localhost:3000' + comment.file_path
                            : 'https://bulma.io/images/placeholders/128x128.png'
                        "
                        alt="Image"
                      />
                    </figure>
                  </div>
                  <div class="media-content">
                    <div class="content">
                      <p>{{ comment.comment }}</p>
                      <p class="is-size-7">{{ comment.comment_date }}</p>
                    </div>
                    <nav class="level is-mobile">
                      <div class="level-left">
                        <a class="level-item" aria-label="like">
                          <span class="icon is-small">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                          </span>
                        </a>
                      </div>
                    </nav>
                  </div>
                </article>
              </div>

              <div class="field">
                <label class="label">Add Comment</label>
                <div class="control">
                  <textarea
                    class="textarea"
                    name="comment"
                    v-model="newComment"
                    placeholder="Add Comment Here"
                  ></textarea>
                </div>
              </div>
              <input
                type="file"
                ref="file"
                @change="() => handleFileUpload()"
              />
              <input class="button is-primary" value="Submit" @click="submit" />
            </div>
          </div>
          <footer class="card-footer">
            <a class="card-footer-item" href="/">To Home Page</a>
          </footer>
        </div>
      </div>
    </section>
  </div>
</template>
