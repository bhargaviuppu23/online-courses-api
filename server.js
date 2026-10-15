const express = require("express");
const app = express();
app.use(express.json());

let courses = [
{id:1,title:"Node.js Basics",instructor:"Arun",category:"Backend",fee:2000,durationHours:20,published:true},
{id:2,title:"React Basics",instructor:"Priya",category:"Frontend",fee:1500,durationHours:15,published:true},
{id:3,title:"Python Programming",instructor:"Rahul",category:"Programming",fee:3000,durationHours:30,published:false}
];

let nextId = 4;

function validCourse(data) {
return typeof data.title==="string" && data.title.trim()!=="" &&
typeof data.instructor==="string" && data.instructor.trim()!=="" &&
typeof data.category==="string" && data.category.trim()!=="" &&
typeof data.fee==="number" && Number.isFinite(data.fee) && data.fee>=0 &&
typeof data.durationHours==="number" && Number.isFinite(data.durationHours) && data.durationHours>0 &&
typeof data.published==="boolean";
}

app.get("/",(req,res)=>{
res.json({message:"Online Courses API is running on port 8080"});
});

app.post("/api/courses",(req,res)=>{
if(!validCourse(req.body)) return res.status(400).json({message:"Invalid course details"});
const course={id:nextId++,title:req.body.title.trim(),instructor:req.body.instructor.trim(),category:req.body.category.trim(),fee:req.body.fee,durationHours:req.body.durationHours,published:req.body.published};
courses.push(course);
res.status(201).json({message:"Course created successfully",course});
});

app.get("/api/courses",(req,res)=>{
let result=[...courses];
const {page="1",limit="5",search,category,published,minFee,maxFee,sort,order="asc"}=req.query;
const p=Number(page),l=Number(limit);

if(!/^[1-9]\d*$/.test(page)||!/^[1-9]\d*$/.test(limit)||!Number.isSafeInteger(p)||!Number.isSafeInteger(l))
return res.status(400).json({message:"Invalid page or limit"});

if(published!==undefined&&published!=="true"&&published!=="false")
return res.status(400).json({message:"Published must be true or false"});

if((minFee!==undefined&&(minFee.trim()===""||!Number.isFinite(Number(minFee))||Number(minFee)<0))||(maxFee!==undefined&&(maxFee.trim()===""||!Number.isFinite(Number(maxFee))||Number(maxFee)<0)))
return res.status(400).json({message:"Invalid fee range"});

if(minFee!==undefined&&maxFee!==undefined&&Number(minFee)>Number(maxFee))
return res.status(400).json({message:"minFee cannot exceed maxFee"});

if(search) result=result.filter(c=>c.title.toLowerCase().includes(search.toLowerCase())||c.instructor.toLowerCase().includes(search.toLowerCase()));

if(category) result=result.filter(c=>c.category.toLowerCase()===category.toLowerCase());

if(published!==undefined) result=result.filter(c=>c.published===(published==="true"));

if(minFee!==undefined) result=result.filter(c=>c.fee>=Number(minFee));

if(maxFee!==undefined) result=result.filter(c=>c.fee<=Number(maxFee));

const allowed=["id","title","instructor","category","fee","durationHours","published"];

if(sort!==undefined&&!allowed.includes(sort))
return res.status(400).json({message:"Invalid sort field"});

if(order!=="asc"&&order!=="desc")
return res.status(400).json({message:"Order must be asc or desc"});

if(sort) {
result.sort((a,b)=>{
let x=a[sort],y=b[sort];
if(typeof x==="string"){x=x.toLowerCase();y=y.toLowerCase();}
if(x<y) return order==="asc"?-1:1;
if(x>y) return order==="asc"?1:-1;
return 0;
});
}

const totalCourses=result.length;
const totalPages=Math.ceil(totalCourses/l);
result=result.slice((p-1)*l,(p-1)*l+l);

res.status(200).json({
totalCourses,
totalPages,
currentPage:p,
limit:l,
courses:result
});
});

app.get("/api/courses/:id",(req,res)=>{
const id=Number(req.params.id);
if(!Number.isSafeInteger(id)||id<1) return res.status(400).json({message:"Invalid course ID"});
const course=courses.find(c=>c.id===id);
if(!course) return res.status(404).json({message:"Course not found"});
res.status(200).json(course);
});

app.put("/api/courses/:id",(req,res)=>{
const id=Number(req.params.id);
if(!Number.isSafeInteger(id)||id<1) return res.status(400).json({message:"Invalid course ID"});
const index=courses.findIndex(c=>c.id===id);
if(index===-1) return res.status(404).json({message:"Course not found"});
if(!validCourse(req.body)) return res.status(400).json({message:"Provide all valid course fields"});

courses[index]={
id,
title:req.body.title.trim(),
instructor:req.body.instructor.trim(),
category:req.body.category.trim(),
fee:req.body.fee,
durationHours:req.body.durationHours,
published:req.body.published
};

res.status(200).json({message:"Course replaced successfully",course:courses[index]});
});

app.patch("/api/courses/:id",(req,res)=>{
const id=Number(req.params.id);
if(!Number.isSafeInteger(id)||id<1) return res.status(400).json({message:"Invalid course ID"});
const course=courses.find(c=>c.id===id);
if(!course) return res.status(404).json({message:"Course not found"});

const allowed=["title","instructor","category","fee","durationHours","published"];
const fields=Object.keys(req.body);

if(fields.length===0||fields.some(f=>!allowed.includes(f)))
return res.status(400).json({message:"Provide valid fields to update"});

const updated={...course,...req.body};

if(!validCourse(updated))
return res.status(400).json({message:"Invalid course values"});

updated.title=updated.title.trim();
updated.instructor=updated.instructor.trim();
updated.category=updated.category.trim();

Object.assign(course,updated);
res.status(200).json({message:"Course updated successfully",course});
});

app.delete("/api/courses/:id",(req,res)=>{
const id=Number(req.params.id);
if(!Number.isSafeInteger(id)||id<1) return res.status(400).json({message:"Invalid course ID"});
const index=courses.findIndex(c=>c.id===id);
if(index===-1) return res.status(404).json({message:"Course not found"});

courses.splice(index,1);
res.status(200).json({message:"Course deleted successfully"});
});

app.use((req,res)=>{
res.status(404).json({message:"Endpoint not found"});
});

const PORT=8080;
app.listen(PORT,()=>{
console.log("Server running at http://localhost:"+PORT);
});
