<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="news" :rules="rules" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="news.title"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="news.author"></el-input>
      </el-form-item>
      <el-form-item label="LOGO" prop="logo">
        <img-preivew :img-data.sync="news.logo.String" />
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input v-model="news.keyword"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.number="news.sort"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <tinymce :height="300" v-model="news.content"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button type="warning" @click="onPublish">发布</el-button>
        <el-button @click="onBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import { getNews, createNews, updateNews } from '@/api/news'
  import waves from '@/directive/waves' // 水波纹指令
  import imgPreivew from '@/components/ImagePreview'
  import en from "../../lang/en";

  export default {
      name: "detail",
      components: {
        Tinymce,
        'img-preivew': imgPreivew
      },
      props: ['id'],
      data () {
        return {
          news: {
            id: 0,
            title: "",
            author: '',
            sort: 0,
            content: '',
            status: 0,
            keyword: '',
            logo: {
              String: '',
              Valid: true
            }
          },
          rules: {
            title: [{required: true, message: 'title is required', trigger: 'change'}],
            author: [{required: true, message: 'author is required', trigger: 'change'}],
            content: [{required: true, message: 'content is required', trigger: 'blur'}]
          }
        }
      },
      mounted(){
        this.initNews()
      },
      methods:{
        async initNews(){
          let resp = await getNews(this.id)
          if (resp.data.code == 200){
            //console.log(resp.data.data)
            let entity = resp.data.data
            this.news.id = entity.id
            this.news.title = entity.title
            this.news.author = entity.author
            this.news.sort = entity.sort
            this.news.content = entity.content
            this.news.status = entity.status
            this.news.keyword = entity.keyword
            this.news.logo.String = entity.logo.String
            this.news.logo.Valid = entity.logo.Valid
          }
        },
        createData(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              createNews(this.news).then(() => {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              })
            }
          })
        },
        updateData(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              const tempData = Object.assign({}, this.news)
              updateNews(tempData.id, tempData).then((resp) => {
                if(resp.data.code == 200) {
                  this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                  })
                }else{
                  this.$notify({
                    title: '失败',
                    message: '更新失败',
                    type: 'warn',
                    duration: 2000
                  })
                }
              })
            }
          })
        },
        onSubmit(){
          if(this.news.id > 0){
            this.updateData()
          }else {
            this.createData()
          }
        },
        onBack(){
          this.$router.go(-1)
        },
        onPublish(){
          this.news.status = 1
          this.onSubmit()
        }
      }
    }
</script>

<style scoped>

</style>
