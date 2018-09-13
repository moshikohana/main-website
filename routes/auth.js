var express = require("express");
var router = express.Router();
var auth = require("../authentication/autentication");
var formidable = require('formidable');
var mysql = require('mysql');
var async = require('async');
var arrays = require('async-arrays');


var pool  = mysql.createPool({
    connectionLimit : 10,
    host:'us-cdbr-iron-east-05.cleardb.net',
    user:'bdc10c6eae8edd',
    password: '14a32b7d',
    database:'heroku_00dc3f3a222b777',
    multipleStatements: true
});

pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
    
});





    
router.get("/getUsers",function(req,res,next) {
    
    pool.getConnection(function(err, connection) {
        
        connection.query("select * from user", function (err, rows, fields) {
            
            if (err) {
                return;
            }
            console.log(rows);
            res.send(rows);
            connection.release();   
        });
    
    });

});











router.get("/getCourses",function(req,res,next) {

    pool.getConnection(function(err, connection) {

        connection.query("select * from course", function (err, rows, fields) {
            
            if (err) {

                return;
            }
            console.log(rows);
            res.send(rows);
            connection.release();
        });

    });

});












router.get("/getUserCourses",function(req,res,next) {

    pool.getConnection(function(err, connection) {

        connection.query("SELECT lnk_courseId FROM link WHERE lnk_userId = ?",req.query.data, function (err, rows, fields) {
            if (err) {

                return;
            }
            console.log(rows);
            res.send(rows);
            connection.release();
        });

    });

});













router.get("/getCourseUsers",function(req,res,next) {
    
    pool.getConnection(function(err, connection) {

        connection.query("SELECT lnk_userId FROM link WHERE lnk_courseId = ?",req.query.data, function (err, rows, fields) {
            if (err) {

                return;
            }

            console.log(rows);
            res.send(rows);
            connection.release();
        });

    });

});









router.post("/login",function(req,res,next) {
    
    var sql = 'SELECT * FROM user WHERE userName = ? AND userPassword = ?';
    //Send an array with value(s) to replace the escaped values:
    pool.query(sql, [req.body.userName, req.body.userPassword], function (err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
    
    });

});
 







router.post("/register", function (req,res,next) {

    var firstName = req.body.userName !==null ? req.body.userName : null;
    var password = req.body.userPassword !==null ? req.body.userPassword : null;
    var email = req.body.userEmail !==null ? req.body.userEmail : null;
    var img = req.body.userImg !==null ? req.body.userImg : null;
    var role = req.body.userRole !==null ? req.body.userRole : null;
    var courses = req.body.courses !==null ? req.body.courses : [];

    var newUser = new auth.Register();

    newUser.setInfo(firstName, password, email, img, role );
    auth.userList.push(req.body);

    addUserToDb(firstName, password, email, img, role, courses);

    res.send("Registration Success");

});






function addUserToDb(firstName,password,email,img,role,courses) {

    var sql = "INSERT INTO user (userName, userPassword, userEmail, userImg, role) VALUES ('" + firstName + "', '" + password + "', '" + email + "', '" + img + "', '" + role + "')";
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
                
        var idUser = result.insertId;
        if(role == "student" ) {
        addUserToLinkDB(idUser, courses);
        }
    });

};

function addUserToLinkDB(idUser, courses ){

    for(var i=0; i<courses.length;i++){
        var idCourse = parseInt(courses[i]);
        var sql = "INSERT INTO link (lnk_userId, lnk_courseId) VALUES ('" + idUser + "', '" + idCourse + "')";
        pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        });
    }
    
}








router.post("/registerCourse", function (req,res,next) {

        var courseName = req.body.courseName !==null ? req.body.courseName : null;
        var courseDesc = req.body.courseDesc !==null ? req.body.courseDesc : null;
        var courseImg = req.body.courseImg !==null ? req.body.courseImg : null;

        var newCourse = new auth.RegisterCourse();

        newCourse.setInfo(courseName, courseDesc, courseImg);
        auth.courseList.push(req.body);
        addCourseToDb(courseName,courseDesc,courseImg);


        res.send("Add course Success");
});

function addCourseToDb(courseName,courseDesc,courseImg) {

    var sql = "INSERT INTO course (courseName, courseDesc, courseImg) VALUES ('" + courseName + "', '" + courseDesc + "', '" + courseImg + "')";
    pool.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);    
    });
};









router.post("/editUser", function (req,res,next){
            
    var sql = "UPDATE user SET userName = '"+ req.body.userName + "', userEmail = '"+ req.body.userEmail + "', userImg = '"+ req.body.userImg + "', role = '"+ req.body.userRole + "' WHERE id = '"+ req.body.userId + "'";
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
        if(req.body.userRole == "student") {
            deleteUserCourses(req.body.userId);
            addUserToLinkDB(req.body.userId, req.body.courses);
        }
    });
    
    res.send("Edited success");

})


function deleteUserCourses(idUser) {
    var sql = "DELETE FROM link  WHERE lnk_userId = '"+ idUser + "'";
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
    });

}







router.post("/editCourse", function (req,res,next){

    var sql = "UPDATE course SET courseName = '"+ req.body.courseName + "', courseDesc = '"+ req.body.courseDesc + "', courseImg = '"+ req.body.courseImg + "'  WHERE id = '"+ req.body.courseId + "'";
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
        });

        res.send("Edited course success");
});









router.post("/deleteUser", function (req,res,next) {

    var sql = "DELETE FROM user WHERE id = '"+ req.body.userId + "'";
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        deleteUserCourses(req.body.userId);
    });

    res.send("User deleted");

});









router.post("/deleteCourse", function (req,res,next) {

    var sql = "DELETE FROM course WHERE id = '"+ req.body.courseId + "'";
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
    });

    res.send("Course deleted");

});









module.exports = router;




