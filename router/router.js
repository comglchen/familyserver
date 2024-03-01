const express = require('express');
const mysql = require('mysql');
const multer = require('multer')
const router = express.Router();

var pool = mysql.createPool({
	connectionLimit: 10,
	//host:'120.26.48.204',
	host: 'localhost',
	user: 'root',
	password: '123789',
	database: 'families'
});
//=======================
let n=''
let d=''
let u=''
//设置存储路径及其他选项（根据自己的需求进行调整）
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		// 指定保存到本地的目录
		
		cb(null, './static/upload')
	},
	filename: function(req, file, cb) {
		// 生成新的文件名
		let imageN = JSON.parse(req.body.dat).imageName.split('.')[1] //把接收到的数据先转为对象再取值
		n = JSON.parse(req.body.dat).modifyName
		d= JSON.parse(req.body.dat).modifyDetail
		//const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + imageN;
		const uniqueSuffix = n+'.'+imageN
		//cb(null, file.fieldname + '-' + uniqueSuffix);
		cb(null,uniqueSuffix);
	
		
	
	
		
	}
});

// 初始化multer
const upload = multer({
	storage: storage
}).single('image');




// 处理文件上传
router.post('/upload', (req, res) => {

	upload(req, res, err => {
		if (err instanceof multer.MulterError) {
			return res.status(500).json({
				error: err.message
			});
		} else if (err) {
			return res.status(500).json({
				error: err.code
			});
		}
		
		// 文件上传成功，返回相关信息或重定向等操作
		console.log("文件上传成功");
		res.sendStatus(204);
	
	console.log("image path:",req.file.path)
	});

});
//处理修改请求
router.post("/modify",(req,res) => {
console.log("222222222",n,d)
	let sql="update myfamily set detail= ? where name= ? "
	let params = [d,n]
	pool.getConnection(function(err, connection) {
		//if(err) throw err;
		connection.query(sql, params, function(error, results, fields) {
	     //  res.send(results);

// res.send("http://localhost:3000/img/image-1709254148203-748163076.jpg")

			connection.release();
			if (error) throw error;
		});
	});	
	
})

//=======================
router.get("/getData", (req, res) => {

	let sql = "select * from myfamily where 1=1 "
	let params = [];
	console.log(req.query.name)
	if (req.query.name) {
		//sql +="and name like ?  or detail like ?  ";
		// params.push("%"+req.query.name+ "%");
		// params.push("%"+req.query.name+"%")
		sql += "and name like ?  ";
		params.push("%" + req.query.name + "%");


	}

	//alert("getData:",req.query.name);
	pool.getConnection(function(err, connection) {
		//if(err) throw err;
		connection.query(sql, params, function(error, results, fields) {
			res.send(results);
			console.log('result:', results);

			/* res.render('suspect',{
				res:results,
			      searchname:req.query.name?req.query.name:''

			}) */
			connection.release();
			if (error) throw error;
		});
	});

})

module.exports = router;