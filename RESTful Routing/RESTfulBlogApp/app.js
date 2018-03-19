var bodyParser   = require("body-parser"),
methodOverride   = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose         = require("mongoose"),
express          = require("express"),
app              = express();

mongoose.connect("mongodb://localhost/restful_blog_app");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body : String,
    created: {type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema); 

app.get("/", function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
     Blog.find({}, function(err, blogs){
        if(err)
             console.log(err);
        else
             res.render("index",{blogs:blogs});
    });
  
});

        //NEW ROUTE

app.get("/blogs/new", function(req, res) {
    res.render("new");
    
});
        //CREATE ROUTE
        
app.post("/blogs",function(req, res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog, function(err, newBlog){
        if(err)
            res.render("new");
        else
            res.redirect("/blogs");
    });
    
});
        //SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err)
        res.render("/blogs");
        else
        res.render("show", {blog:foundBlog});
   });
});

        //EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
       res.redirect("/blogs");
        else
         res.render("edit",{blog:foundBlog});
    });
});
        
        //UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
    
        req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err)
         res.redirect("index");
        else
         res.redirect("/blogs/" + req.params.id);
    });
});

        //DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else
        res.redirect("/blogs");
    });
});
// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1496134732667-ae8d2853a045?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e4dd1c9106a69065ccfa21a36cfb53b1&auto=format&fit=crop&w=500&q=60",
//     body: "Hello, this is a Blog Post!",
    
// });

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});
