// //introspecting the user token

// const permit = (permittedRoles) => {

//     return async (req, res, next) => {

//       var userrole = req.user['cognito:groups'][0] || 'novigo-admin';                                    

//                   try {                    

//                     if(permittedRoles.indexOf(userrole) !=-1 ) {

//                       next();

//                     } else {

//                       return next({status:403, message:`No roles specified for user`});

//                     }

//                   } catch (err) {

//                     next(err);

//                   } finally {



//                   }

//   }

//   }




//   module.exports = permit;

// //middileware
// const roles = {
//     "CLIENT": { VIEW_ROLE: ["novigo-admin", "client_view"], EDIT_ROLE: ["novigo-admin"] },

//     "CONTRACTOR": { VIEW_ROLE: ["novigo-admin", "resource"], EDIT_ROLE: ["novigo-admin"] },
//     "PROJECT": { VIEW_ROLE: ["novigo-admin", "resource"], EDIT_ROLE: ["novigo-admin"] },
//     "Project-Resource": { VIEW_ROLE: ["novigo-admin", "resource"], EDIT_ROLE: ["novigo-admin"] },
//     "RESOURCE": { VIEW_ROLE: ["novigo-admin", "resource"], EDIT_ROLE: ["novigo-admin"] },
//     "ROLE": { VIEW_ROLE: ["novigo-admin", "resource"], EDIT_ROLE: ["novigo-admin"] },
//     "TENANTS": { VIEW_ROLE: ["novigo-admin", "resource"], EDIT_ROLE: ["novigo-admin"] }
// }
// module.exports = roles;


// const express = require("express");
// const app = express();
// const RESOURCE_FIELDS = require("../Schema/resource.json");
// const formatModule = require("../Common/format");
// const topicName = "tms-resources";
// const subscriptionName = "tms-resources-sub"
// const {subscribeOnTopic} = require("../PubSub/Subscriber")

// var AWS = require('aws-sdk');
// const dotenv = require('dotenv');

// // get config vars
// dotenv.config();

// const SESConfig = {
// //   apiVersion: process.env.apiVersion,
//   accessKeyId: process.env.accessKeyId,
//   accessSecretKey: process.env.accessSecretKey,
//     region: "ap-south-1",
// }

// var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(SESConfig);

// app.use(express.json());

// var DB = require("../DB/Connection");

// checkForPubsubMessage()
// async function checkForPubsubMessage() {
//  try {
//     const subscription = await subscribeOnTopic(topicName, subscriptionName);
//     // Listen for new messages until timeout is hit
//     subscription.on("message", messageHandler);
    
//  } catch (error) {
//      console.log(error)
//  }
// }

// const messageHandler = (message) => {
//     var payload = JSON.parse(Buffer.from(message.data).toString());
//     console.log("Recived message on contractor:",payload)
//     if(payload.action == 'add') createNewresource(payload)
//     if(payload.action == 'update') updateresource(payload)
//     if(payload.action == 'delete') deleteresource(payload)
//     if(payload.action == 'softdelete') deleteresourceRecord(payload)

//     // Ack the messae
//     message.ack();
// };

// app.get("/getResource", async (req, res, next)=>{
//     var db = req.db;
//     try {
//         var query = `select re.resource_id , re.resource_type, re.tenants_id, re.role_id, ro.role_name, re.resource_name, re.email, re.contact_no, re.address, re.location from timesheet.resource as re
//         left join timesheet.role as ro ON ro.role_id = re.role_id where active = true`
//         var results = await db.query(query);
//         var fieldSchemaforresources = RESOURCE_FIELDS["RESOURCE_FIELDS"];
//         results.fields = await formatModule.formatFields(fieldSchemaforresources, results.fields);
//         res.status(200).json(results)
//         console.log("resources from Timesheet Schema")
//     } catch (err) {
//         console.log(err)
//         next(err);
//     }finally{
//         db.close();
//     }
    
// });

// //api to get resource by name using Like %
// app.get("/getResourceByName", async (req, res, next)=>{
//     var db = req.db;
//     var {resource_name} = req.query;
//     try {
//         var query = `SELECT resource_id as key, resource_name as value, resource_type from timesheet.resource where resource_name ILIKE '%${resource_name}%' and role_name != 'Manager'
// 		LIMIT 20`
//         console.log(query);
//         var results = await db.query(query);
//         res.status(200).json(results.rows)
//         console.log("Resource list from Timesheet Schema")
//     } catch (err) {
//         console.log(err)
//         next(err);
//     }finally{
//         db.close();
//     }
// })

// app.get("/getProjectManagerByName", async (req, res, next)=>{
//     var db = req.db;
//     var {resource_name} = req.query;
//     try {
//         var query = `SELECT resource_id as key, resource_name as value, resource_type from timesheet.resource where resource_name ILIKE '%${resource_name}%' and role_name = 'Manager'
// 		LIMIT 20`
//         console.log(query);
//         var results = await db.query(query);
//         res.status(200).json(results.rows)
//         console.log("Project Manager list from Timesheet Schema")
//     } catch (err) {
//         console.log(err)
//         next();
//     }finally{
//         db.close();
//     }
// })

// async function createNewresource(payload) {
//     const db = await DB();
//     //var db = req.db;
//     try {
//         const {resource_id, tenantid, role_id, role_name, resource_name, email, contact_no, address, resource_type, location} = payload;
//         console.log("payloda", payload);
//         const tenantsId = (tenantid) ? "'"+tenantid+"'" : null;
//         const Email = (email) ? "'"+email+"'" : null;
//         const ContactNumber = (contact_no) ? "'"+contact_no+"'" : null;
//         const Address = (address) ? "'"+address+"'" : null;
//         const roleId = (role_id) ? "'"+role_id+"'" : null;
//         const roleName = (role_name) ? "'"+role_name+"'" : null;
//         const resourceType = (resource_type) ? "'"+resource_type+"'" : null;
//         const Location = (location) ? "'"+location+"'" : null;
//         var query = `INSERT INTO timesheet.resource(resource_id, tenants_id, role_id, role_name, resource_name, email, contact_no, address, resource_type, location)
//             VALUES ('${resource_id}', ${tenantsId}, ${roleId}, ${roleName}, '${resource_name}', ${Email}, ${ContactNumber}, ${Address}, ${resourceType}, ${Location});`;
//             await db.query(query);
//             console.log("Inserted resources to timesheet schema");
//         } catch (err) {
//             console.log(err)
//         }  finally {
//           db.close();
//         }
// }

// async function updateresource(payload){
//     const db = await DB();
//     try {
//         //const {resource_id} = req.params;
//         const {resource_id, role_id, role_name, resource_name, email, contact_no, address, resource_type, location} = payload;
//         const Email = (email) ? "'"+email+"'" : null;
//         const ContactNumber = (contact_no) ? "'"+contact_no+"'" : null;
//         const Address = (address) ? "'"+address+"'" : null;
//         const roleId = (role_id) ? "'"+role_id+"'" : null;
//         const roleName = (role_name) ? "'"+role_name+"'" : null;
//         const resourceType = (resource_type) ? "'"+resource_type+"'" : null;
//         const Location = (location) ? "'"+location+"'" : null;
//         console.log(payload);
//         var query = `UPDATE timesheet.resource SET  role_id = ${roleId}, role_name = ${roleName}, resource_name = '${resource_name}', email = ${Email}, contact_no = ${ContactNumber}, address = ${Address}, resource_type = ${resourceType}, location=${Location}
//         where resource_id = '${resource_id}' RETURNING *`;
//         await db.query(query);
//         console.log("Updated resources to timesheet schema");
//     } catch (err) {
//         console.log(err)
//     }  finally {
//       db.close();
//     }
// }

// async function deleteresource(payload){
//     const db = await DB();
//     try {
//         const {resource_id} = payload;
//         var query = `DELETE from timesheet.resource where resource_id = '${resource_id}'`;
//         await db.query(query);
//         console.log("Deleted resources to timesheet schema");
//     } catch (err) {
//         console.log(err)
//     }  finally {
//       db.close();
//     }
// }

// async function deleteresourceRecord(payload){
//     const db = await DB();
//     try {
//         const {resource_id} = payload;
//         var query = `UPDATE timesheet.resource SET active=false where resource_id = '${resource_id}'`;
//         await db.query(query);
//         console.log("Deleted resources to timesheet schema");
//     } catch (err) {
//         console.log(err)
//     }  finally {
//       db.close();
//     }
// }

// app.get('/loadUsers',(req, res, next) => {
//     var params = {
//         GroupName: 'resource', /* required */
//         UserPoolId: 'ap-south-1_DebDD634R', /* required */
//         Limit: '5'
//       };
//       let userList = [];
//       cognitoidentityserviceprovider.listUsersInGroup(params, function(err, data) {
//         if (err) console.log(err, err.stack); // an error occurred
//         else {
//             if(data.Users) {
//                 data.Users.forEach((user) => {
//                     let userObj = {};
//                     var userAtt = {}
//                     user.Attributes.forEach((attribute) => {
//                         userAtt[attribute.Name] = attribute.Value
//                     })
//                     userObj.resource_id = user.Username;
//                     userObj.resource_name = userAtt.name;
//                     userObj.email = userAtt.email;
//                     userObj.contact_no = userAtt.phone_number;
//                     userList.push(userObj)
//                 })
//             }
//             res.send(userList)
//         }          // successful response
//       });
//   })

// module.exports = app;




// console.log("hi");

// userrole = [2,5,6,8,9]

// function double(x){
//     return x*2
// }

// const result = arr.map((x)=>
//     x.tostring(2)
// );

// console.log(result);

// const result1 = arr.forEach(( i, array)=>{
//     console.log(array);
// });
// console.log(result1);

//   arr.indexoff((x)=> x!= -1)
//  console.log(arr);


//   arr.indexOf()

//  console.log(arr);

arr = [2,5,6,8,9]


const result = arr.map((x)=>{
  return x * 2
})
console.log(result);

var name = "anji";
console.log(name);