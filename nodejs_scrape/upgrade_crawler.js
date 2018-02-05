
var http = require('http')
var Promise = require('bluebird')
var url = 'http://www.imooc.com/learn/348'
var baseUrl = 'https://www.imooc.com/t/108492'
var cheerio = require('cheerio');
var videoIds = [728,637,348,259,197,134,75]

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
    var title = $('.path a span').text()
    var number = parseInt($($('.static-item .meta-value js-learn-num').text().trim(),10)
        // courseData={
        // title:title,
        // number:number,
        // videos:[{
        //     chapterTitle:'',
        //     video: [
        //         title:'',
        //         id:''
        //     ]
        // }]
        // }
        var courseData = {
            title: title,
            number: number,
            videos: []
        }
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
                    id: id // 遍历完后将videotitle和idpush到chaperData.videos里
                })
            })
            courseData.push(chapterData) //将分析完后的chapterData保存到courseData里
        }) return courseData
    }

    function printCourseInfo(coursesData) { //定义打印方法最后将需要的数据打印出来在控制台   
        coursesData.forEach(function (courseData) {
            console.log(courseData.number + '人学过' + courseData.title + '\n')
        })
        coursesData.forEach(function (courseData) {
            console.log('###' + courseData.title + '\n') //###代表课程标题
            coursesData.forEach(function (item) {
                var chapterTitle = item.chapterTitle
                console.log(chapterTitle + '\n') // 打印出一级标题换行

                item.videos.forEach(function (video) {
                    console.log('【' + video.id + '】' + video.title + '\n')
                })
            })
        })
    }

    function getPageAsync(url) { //定义爬取函数
        return new Promise(function (resolve, reject) {
            console.log('正在爬取' + url)
            http.get(url, function (res) {
                var html = ''

                res.on('data', function (data) {
                    html += data
                })
                res.on('end', function () {
                    resolve(html)
                    // var courseData = filterChapters(html)
                    // printCourseInfo(courseData)    //结束后将courseData打印出来，调用打印函数
                })
            }).on('error', function (e) {
                reject(e) //爬取出错就定义错误信息
                console.log('获取课程数据出错')
            })
        })
    }

    var fetchCourseArray = [] //定义数组

    videoIds.forEach(function (id) {
        fetchCourseArray.push(getPageAsync(baseUrl + id))
    })
    Promise
        .all([])
        .then(function (pages) {
            var coursesData = []

            pages.forEach(function (html) {
                var courses = filterChapters(html) //用定义的过滤器解析courses

                coursesData.push(courses) //解析完毕后将结果保存到coursesData
            })

            courseData.sort(function (a, b) {
                return a.number < b.number //从大到小的排序
            })
            printCourseInfo(courseData) //调用打印方法
        })