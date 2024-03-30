const express = require('express');
const mysql = require('mysql');
const multer = require('multer')
const router = express.Router();
const jwt = require('jsonwebtoken')
var pool = mysql.createPool({
	connectionLimit: 10,
	host: '120.26.48.204',
	user: 'root',
	password: 'Mysql_00667192',
	database: 'families'
});
// var pool = mysql.createPool({
// 	connectionLimit: 10,

// 	host: 'localhost',
// 	user: 'root',
// 	password: '123789',
// 	database: 'families'
// });
//=======================



//设置存储路径及其他选项（根据自己的需求进行调整）
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		// 指定保存到本地的目录

		cb(null, './static/upload')
	},
	filename: function(req, file, cb) {
		// 生成新的文件名
		let imageN = JSON.parse(req.body.dat).imageName.split('.')[1] //把接收到的数据先转为对象再取值
		let imgPrName =JSON.parse(req.body.dat).imgPrName
		//const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + imageN;
		const uniqueSuffix = imgPrName + '.' + imageN
		//cb(null, file.fieldname + '-' + uniqueSuffix);
		cb(null, uniqueSuffix);

	}
});

// 初始化multer
const upload = multer({
	storage: storage
}).single('image');

//登录处理
router.post('/login', (req, res) => {
	let sql = "select * from myfamily where username= ? and password= ? "
	let params = []
	const secretKey = 'baby-i-love-u'
	const payload = {
		password: req.body.password
	}
	const token = jwt.sign(payload, secretKey, {
		expiresIn: '1h'
	})
	//res.setHeader('Access-Control-Expose-Headers','token')	




	if (req.body.username) {
		params.push(req.body.username)
	}
	if (req.body.password) {
		params.push(req.body.password)
	}
	pool.getConnection(function(err, connection) {
		//if(err) throw err;
		connection.query(sql, params, function(error, results, fields) {

			if (results.length) {
				//res.setHeader('token',token);
				//results.token=token
				res.send({
					results,
					token: token
				})
				console.log("results====>>>>", results)
			} else {
				res.send({
					results,
					token: ''
				})
			}




			connection.release();
			if (error) throw error;
		});
	});
	console.log('router.post-->', req.body.username, req.body.password)
})


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

		console.log("image path:", req.file.path)
	});

});
//处理修改请求
router.post("/modify", (req, res) => {
	
	let sql = "update myfamily set detail= ? ,phone = ?  where name= ? "
	let params = [req.body.modifyDetail,req.body.modifyPhone,req.body.modifyName]
	pool.getConnection(function(err, connection) {
		//if(err) throw err;
		connection.query(sql, params, function(error, results, fields) {
			//  res.send(results);

			// res.send("http://localhost:3000/img/image-1709254148203-748163076.jpg")
            res.sendStatus(200);
			connection.release();
			if (error) throw error;
		});
	});

})

//=======================
router.get("/getData", (req, res) => {

	let sql = "select * from myfamily where 1=1 "
	let params = [];
	console.log('dirname', __dirname)
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
			//console.log('result:', results);

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