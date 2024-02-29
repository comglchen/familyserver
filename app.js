const express = require('express');
const router=require('./router/router.js')
const bodyParser = require('body-parser')
const multer=require('multer')
const cors=require('cors')
let app = express()
//=============================




//============================




const port = '3000'


app.use(cors())
app.use(router);
app.use('/upload', express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false })); // 解析表单提交的数据
app.use(bodyParser.json()); // 解析JSON格式的数据
app.listen(port, () => {
	console.log('listenPort:', port)
})
