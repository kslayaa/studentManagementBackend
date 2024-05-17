const express = require("express")
const jwt = require("jsonwebtoken")
const app = express()

let students=[
    {
        "id":"1",
        "name":"shruthilaya",
        "branch":"CSE",
        "section":"E"
    },
    {
        "id":"2",
        "name":"shruthi",
        "branch":"CSE",
        "section":"E"
    },
    {
        "id":"3",
        "name":"laya",
        "branch":"CSE",
        "section":"E"
    }
]

app.use(express.json())


app.get('/',(req,res)=>{
    res.status(200).send("Student Management System")
})

app.get('/api/students/:id',(req,res)=>{
    const {id} = req.params;
    const student = students.find(stu=>stu.id===id);
    if(!student){
        res.status(404).send("Student not found")
    }
    else{
        res.status(200).send(student)
    }
})

app.get('/api/students/',(req,res)=>{
    res.status(200).send(students)
})

app.post('/api/students/',auth,(req,res)=>{
    jwt.verify(req.token,"secret key",(err,data)=>{
        if(err) res.status(404).send("Unauthorized user");
       
    })
    const {id,name,branch,section} = req.body;
    let student=students.find(each=>each.id===id)
    if(student){
        res.status(400).send("Student already exists")
    }
  
    else{
        student = {"id":id,"name":name,"branch":branch,"section":section}
        students.push(student)
        res.status(200).json(student)
        console.log(req.body)
    }
})

app.put('/api/students/:id',auth,(req,res)=>{
    jwt.verify(req.token,"secret key",(err,data)=>{
        if(err) res.status(404).send("Unauthorized user");
       
    })
    const {id}=req.params
    console.log(typeof id)
    const student = students.find(stu=>stu.id===id);
    console.log(student)
    if(student){
        const {name,branch,section}=req.body 
        student.id=id;
        student.name=name;
        student.branch=branch;
        student.section=section;
        res.status(200).json(student);
    }
    else{
        res.status(404).send("Student not found")
    }
})

app.delete('/api/students/:id',auth,(req,res)=>{
    jwt.verify(req.token,"secret key",(err,data)=>{
        if(err) res.status(404).send("Unauthorized user");
       
    })
    const {id} = req.params 
    students=students.filter(stu=>stu.id!==id)
    res.status(200).json(students)
})

app.post('/login',(req,res)=>{
    const loginDetails = req.body
    jwt.sign(loginDetails,"secret key",(err,token)=>{
        res.status(200).send({token})
    })
})

function auth(req,res,next){
    const token = req.headers.authorization.split(" ")[1]
    req.token=token
    next();
}

app.listen(3000,()=>{
    console.log("port 3000")
})