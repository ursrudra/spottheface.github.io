const app = require('http')
.createServer((req,res) => res.send("Hi  Good Morning")); 

const PORT =  process.env.PORT;
app.listen(PORT,()=>{
	console.log(`server listening on port ${PORT}`);
});

// console.log(process.env);