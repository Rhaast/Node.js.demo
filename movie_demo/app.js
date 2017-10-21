var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var _ = require('underscore') //引入更新对象的方法
var Movie = require('./models/movie') //引入模型
var port = process.env.PORT || 3000 //设置端口
var mongoose = require('mongoose')
var app = express()

mongoose.connect('mongodb://localhost/imooc') //连接数据库 

app.set('views', './views/pages') //设置视图引擎
app.set('view engine', 'jade') //设置模板引擎为jade
app.use(bodyParser.urlencoded())
app.use(express.static(path.join(__dirname, 'public'))) //获取静态资源目录
app.locals.moment = require('moment')
app.listen(port)


console.log('sucess start' + port)

// index page
app.get('/', function(req, res) {
    Movie.fetch(function(err, movies) {
      if (err) {
        console.log(err)
      }

      res.render('index', {
        title: '首页',
        movies: movies
      })
    })
  })
  // detail page
app.get('/movie/:id', function(req, res) {
    var id = req.params.id

    Movie.findById(id, function(err, movie) { //找到当前选中电影的id，进入详情页
      res.render('detail', {
        title: 'imooc' + movie.title,
        movie: movie
      })
    })
  })
  // admin page
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
      title: '后台录入页',
      movie: {
        title: '',
        doctor: '',
        country: '',
        year: '',
        poster: '',
        flash: '',
        summary: '',
        language: ''
      }
    })
  })
  //admin update movie更新电影
app.get('/admin/update/:id', function(req, res) {
  var id = req.params.id
  if (id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: '后台更新页',
        movie:movie
      })
    })
  }


})


//admin post movie
app.post('/admin/movie/new', function(req, res) { //修改电影数据和新增电影
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie
  if (id !== 'undefined') {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err)
      }
      _movie = _.extend(movie, movieObj) //如果查询电影id存在，则在此基础上更新并保存
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err)
        }
        res.redirect('/movie/' + movie._id)
      })
    })
  } else { //如果id不存在，则重新定义定义新的模型字段
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash


    })
    _movie.save(function(err, movie) {
      if (err) {
        console.log(err)
      }
      res.redirect('/movie/' + movie._id)
    })
  }
})

// list page
app.get('/admin/list', function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err)
    }
    res.render('list', {
      title: '列表页',
      movies: movies
    })
  })
})

// list delete movie
app.delete('/admin/list', function(req, res) {
    var id = req.query.id

    if(id) {
        Movie.remove({_id: id}, function(err, movie) {
            if(err) {
                console.log(err)
            }
            else {
                res.json({success: 1})
            }
        })
    }
})