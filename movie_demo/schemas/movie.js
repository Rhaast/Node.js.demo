var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({         //定义字段
    doctor:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
    meta:{
        createAt:{                     //可记录创建数据的时间
          type: Date,
          default: Date.now()
        },
        updateAt:{                     //更新数据的时间
          type: Date,
          default: Date.now()
        }
    }
})

MovieSchema.pre('save', function(next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()    //判断数据是否新加，如果是，就把创建时间设置为当前时间

    } else {
        this.meta.updateAt = Date.now()  //如果数据已经有了，那就只更新updateAt
    }

    next()
})

MovieSchema.statics = {
    fetch: function(cb) {      //fetch方法用来取出目前数据库的所有数据
        return this
          .find({})            //获取全部
          .sort('meta.updateAt')   //排序，按照更新时间来排
          .exec(cb)
    },
    findById: function(id, cb) {      //findById用于查询单条数据的方法
        return this
          .findOne({_id: id})    //通过id获取单条数据
          .exec(cb)
    }
}

module.exports = MovieSchema      //匿名输出模式
