const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
const  knex = require('knex');
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'rudra006',
    database : 'smart_brain'
  }
});
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.get(  '/' ,   ( req, res) => {
res.send(database.users );
});

//Signin start

app.post('/signin', (req, res) =>{
  db.select('*')
  .from('login')
  .where('email', '=' , req.body.email)
  .then(data =>{
  	const isValid = bcrypt.compareSync(req.body.password, data[0].hash); 
  	if(isValid)
  	{db.select('*')
  	  	.from('users')
  	  	.where('email', '=', req.body.email)
  	  	.then(user =>{
  	  		res.json(user[0])
  	  	})
  	  	.catch(err => res.status(400).json("Unable to get the user")); 
  	  }
  	  else
  	  {
  	  	res.status(400).json("Wrong Credentials");
  	  }
  })
  .catch(err => res.status(400).json('Wrong Credentials'));
});
//signin ends
app.post('/register', (req, res) =>{
   const {email, name, password} = req.body;
   const hash = bcrypt.hashSync(password);
   db.transaction(trx =>{
   	trx.insert({
   		hash: hash,
   		email:email
   	})
   	.into('login')
   	.returning('email')
   	.then(loginEmail =>{
	   	return trx('users')
	   	.returning('*')
	   	.insert({
	   	email:loginEmail[0],
	   	name:name,
	   	joined:new Date()
		   }).then(
	   user => {
   	res.json(user[0]);
	   })
   	})
   	.then(trx.commit)
   	.catch(trx.rollback)
   })
   
.catch(err => res.status(400).json("Unable to register"));

})

app.get('/profile/:id', (req, res) =>{
	const { id } = req.params;
	db.select('*')
	.from('users')
	.where({ id })
	.then(user =>{
		if(user.length)
		{
		res.json(user[0]);
		}
		else{
		res.status(400).json("Not found");	
		}

	})
	.catch(err => res.status(400).json("Error getting User"));
})

app.put('/image', (req, res) =>{
	const { id } = req.body;
             db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries =>{
		res.json(entries[0]);
 	})
 	.catch(err => res.status(400).json("Unable to get the user entries"))
})

app.listen(3002);