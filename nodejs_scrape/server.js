/**
 * Created by Administrator on 2017/3/1.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/',function (req,res) {

    //all scrape magic will happen here

    url  = 'https://segmentfault.com/news';

    request(url, function (err,res,html) {
        if (!err){
            var $ = cheerio.load(html);

            var title;

            $('.mr10').filter(function () {
                var data = $(this);

                title = data.text();

                console.log('title is ' + title);
                
            });
        }
    });

});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;