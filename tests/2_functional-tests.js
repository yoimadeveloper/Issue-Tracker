const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let deleteID;
suite('Functional Tests', function() {
  suite("Routing Tests", function() {
    suite("3 Post request Tests", function() {
      test("Create an issue with every field: POST request to /api/issues/{project}", function(done) {
        chai
        .request(server)
        .post("/api/issues/projects")
        .set("content-type", "application/json")
        .send({
          issue_title: "crap",
          issue_text: "sick",
          created_by: "buck",
          assigned_to: "doc",
          status_text: "done",
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          deleteID = res.body._id;
          assert.equal(res.body.issue_title, "crap");
          assert.equal(res.body.assigned_to, "doc");
          assert.equal(res.body.created_by, "buck");
          assert.equal(res.body.status_text, "done");
          assert.equal(res.body.issue_text, "sick");
          done();
        });
      });
      test("Create an issue with only required fields: POST request to /api/issues/{project}", function(done) {
        chai
        .request(server)
        .post("/api/issues/projects")
        .set("content-type", "application/json")
        .send({
          issue_title: "Neha",
          issue_text: "tension",
          created_by: "rawat",
          assigned_to: "",
          status_text: ""
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title,"Neha");
          assert.equal(res.body.created_by,"rawat");
          assert.equal(res.body.issue_text,"tension");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text,"");
          done();          
        });
      });
      test("Create an issue with missing fields: POST request to /api/issues/{project}", function(done) {
        chai
        .request(server)
        .post("/api/issues/projects")
        .set("content-type", "application/json")
        .send({
          issue_title: "",
          issue_text: "",
          created_by: "fCC",
          assigned_to: "",
          status_text: "",
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });
  
  suite("3 Get request Tests", function() {
      test("View issues on a project: GET request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .get("/api/issues/mohit")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 3);
          done();
      });
    });
      test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
      chai
      .request(server)
      .get("/api/issues/mohit")
      .query({
        _id: "60ab7a4c4c9ed100e47a1d03"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body[0], {
          "_id":"60ab7a4c4c9ed100e47a1d03",
          "issue_title":"hi",
          "issue_text":"i am sick ","created_on":"2021-05-24T10:05:00.312Z","updated_on":"2021-05-24T10:05:00.312Z","created_by":"mohit",
          "assigned_to":"doc",
          "open":true,
          "status_text":"critical"
        });
        done();
      });
    });
      test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
      chai
      .request(server)
      .get("/api/issues/mohit")
      .query({
        issue_title: "hi",
        issue_text: "iam",
      })
      .end(function(err, res){
        assert.equal(res.status,200);
        assert.deepEqual(res.body[0], {
        "_id":"60ab7d39188cb002126a19b7",
        "issue_title":"hi",
        "issue_text":"iam","created_on":"2021-05-24T10:17:29.345Z","updated_on":"2021-05-24T10:17:29.345Z","created_by":"mohit",
        "assigned_to":"pawna",
        "open":true,
        "status_text":"jfkasdj"
        });
        done();
      })
    })
  });

  suite("5 Put requst Tests", function() {
    test("Update one field of an issue: PUT request to /api/issues/test-data-put", function (done) {
      chai
      .request(server)
      .put("/api/issues/mohit123")
      .send({
        _id: "60ab7eaf188cb002126a19b9",
        issue_title: "mohit",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "60ab7eaf188cb002126a19b9");

        done();
      });
    });
    test("Update multiple filed on a issue: PUT request to /api/issues/{project}", function (done) {
      chai
      .request(server)
      .put("/api/issues/mohit123")
      .send({
        _id: "60ab7eaf188cb002126a19b9",
        issue_title: "mohit",
        issue_text: "mohit",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "60ab7eaf188cb002126a19b9");
        
        done();
      });
    });
    test("Update an issue with missing _id: PUT request to api/issues/{project}", function (done) {
      chai
      .request(server)
      .put("/api/issues/test-data-put")
      .send({
        issue_title: "update",
        issue_text: "update",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
    });
    
    test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
      chai
      .request(server)
      .put("/api/issues/test-data-put")
      .send({
        _id: "60aa76a210b3be077abb3fff",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "no update field(s) sent");
        done();
      });
    });

      test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function(done){
      chai
      .request(server)
      .put("/api/issues/test-data-put")
      .send({
      _id: "60aa76a210b3be077abb3fff",
      issue_title: "update",
      issue_text: "update",
    })
    .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not update");

        done();
     });
    });
  });

  suite("3 DELETE request Tests", function () {
    test("Delete an issue: Delete request to /api/issues/projects", function(done) {
      chai
      .request(server)
      .delete("/api/issues/projects")
      .send({
        _id: deleteID,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");
        done();
      })
    })
    
      test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function(done) {
      chai
      .request(server)
      .delete("/api/issues/projects")
      .send({
        _id: "60aa76a210b3be077abb3fffinvalid",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200)
        assert.equal(res.body.error,"could not delete");
        done();
      });
    });
  

    test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function(done){
      chai
      .request(server)
      .delete("/api/issues/projects")
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
        });
      });
    });
  });
});