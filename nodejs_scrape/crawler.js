var http = require('http')
var url = 'http://www.imooc.com/learn/348'
var cheerio = require('cheerio');

// //爬取页面整篇html的写法
// http.get(url, function(res) {
//     var html = ''

//     res.on('data', function(data) {
//         html += data
//     })
//     res.on('end', function() {
//         console.log(html)
//     })
// }).on('error', function() {
//     console.log('获取课程数据出错')

// })
function filterChapters(html) { //定义过滤装载后的html
    var $ = cheerio.load(html) // 用cheerio模块解析html

    var chapters = $('.chapter') //定义chapters来拿到html数据里的大章节
    // [{
    //     chapterTitle:'',
    //     video: [
    //         title:'',
    //         id:''
    //     ]
    // }]

    var courseData = []

    chapters.each(function (item) { //遍历每一个大章节
        var chapter = $(this)
        var chapterTitle = chapter.find('strong').text() //遍历大标题
        var videos = chapter.find('.video').children('li') //每一章下的子目录
        var chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        }
        //遍历video
        videos.each(function (item) {
            var video = $(this).find('.J-media-item') //获取video下每个子目录的标题
            var videoTitle = video.text()
            var id = video.attr('href').split('video/')[1]
            
            chapterData.videos.push({
                title: videoTitle,
                id: id                     // 遍历完后将videotitle和idpush到chaperData.videos里
            })
        })
        courseData.push(chapterData)    //将分析完后的chapterData保存到courseData里
    })
    return courseData
}
function printCourseInfo(courseData) { //定义打印方法最后将需要的数据打印出来在控制台   
  courseData.forEach(function(item){
      var chapterTitle = item.chapterTitle
      console.log(chapterTitle +'\n') // 打印出一级标题换行

      item.videos.forEach(function(video) {
          console.log('【'+ video.id +'】' + video.title +'\n')

      })
  })
}
http.get(url, function (res) {
    var html = ''

    res.on('data', function (data) {
        html += data
    })
    res.on('end', function () {
        var courseData = filterChapters(html)
        printCourseInfo(courseData)    //结束后将courseData打印出来，调用打印函数
    })
}).on('error', function () {
    console.log('获取课程数据出错')

})