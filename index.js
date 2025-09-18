const express = require('express');
const bodyPaarser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyPaarser.urlencoded({extended: true}));
app.use(express.static('public'));

var items = [];

var example =  "Working";
app.get("/", function(req, res){
    var priority = req.query.priority || "all";
    
    var filteredItems = items;
    if (priority !== "all") {
        filteredItems = items.filter(item => item.priority === priority);
    }
    
    var filteredIndices = [];
    if (priority === "all") {
        for (var i = 0; i < items.length; i++) {
            filteredIndices.push(i);
        }
    } else {
        for (var i = 0; i < items.length; i++) {
            if (items[i].priority === priority) {
                filteredIndices.push(i);
            }
        }
    }
    
    res.render("list", { 
        items: filteredItems,
        allItems: items,
        indices: filteredIndices,
        currentPriority: priority 
    });
})

app.get("/edit/:id", function(req, res){
    var id = req.params.id;
    var item = items[id];
    res.render("edit", {item: item, id: id});
})

app.post("/", function(req, res){
    var taskText = req.body.ele1;
    var priority = req.body.priority || "medium";
    if (taskText && taskText.trim() !== "") {
        items.push({
            text: taskText,
            priority: priority
        });
    }
    
    res.redirect("/");
});

app.post("/update/:id", function(req, res){
    var id = req.params.id;
    var updatedText = req.body.updatedItem;
    var updatedPriority = req.body.priority || items[id].priority;
    if (updatedText && updatedText.trim() !== "") {
        items[id] = {
            text: updatedText,
            priority: updatedPriority
        };
    }
    
    res.redirect("/");
});


app.post("/delete/:id", function(req, res){
    var id = req.params.id;
    items.splice(id, 1);
    res.redirect("/");
});

app.listen(3000, function(){
    console.log('Server is running on port 3000');
});
