const express = require("express");
const cluster = require("cluster");
const os = require("os");

//it's vertical scaling in node.js using cluster module
//as we know js is single threaded it can use only one thread
//my device has total 8 cores, 16 threads total, means 2 thread each core..i9
//so to vertical scale our node js process means to utilize the whole cores we can use cluster module in node.js


// when i am sending the req from different browser from same device pid is not chaning but from different device it changes


//it will print total number of cpus present in your machine
const totalCpu = os.cpus().length;
const port =3000;

//agar this index.js file running on primary means it run by user only
if(cluster.isPrimary){
    console.log("number of threads in cpu",totalCpu);
    console.log("primary",process.pid);

    //fork the same process (index.js) till total no. of cpu present
    for(let i = 0;i<totalCpu;i++){
        cluster.fork();
    }

    //if one of the worker dies or exit kill everything
    cluster.on("exit",(worker,code,signal)=>{
        console.log("worker died",worker.process.pid);
        process.exit();
    })

}else{
    const app = express();


    app.listen(port, () => {
        console.log("Server running on port 3000, worker/process ID:", process.pid);
    });


    app.get("/",(req,res)=>{
      return  res.status(200).json({
            message:`server running on thread id ${process.pid}`
        })
    });


    app.get("/random", (req, res) => {
        return res.status(200).json({
            message: `Server running on thread ID ${process.pid}, random: ${Math.random()}`
        });
    });

}




