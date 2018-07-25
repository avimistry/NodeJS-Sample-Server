module.exports = {
	'port': 8080,
	'secret': 'n0de<3you', // secret key for encrypt token
	'database': { 
		'url':'mongodb:27017/nodejs', // localhost if running without docker
		'user':'bm9kZWpz', //nodejs
		'password':'bm9kZWpzIzEyMw==' //nodejs#123
	}, // configuration for database connection
	'mail_configuration': {
		'host':'smtp.gmail.com',
		'port':'587',
		'user':'YWRtaW5Abm9kZWpzLmNvbQ==', // enter your gmail email address in base64
		'password':'YWRtaW4=' //enter your gmail password in base64
	}, // mail agent configuration to send a mail
	'expiredTime': 12 //in hours
	
};
