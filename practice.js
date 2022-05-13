//introspecting the user token

const permit = (permittedRoles) => {

    return async (req, res, next) => {

      var userrole = req.user['cognito:groups'][0] || 'novigo-admin';                                    

                  try {                    

                    if(permittedRoles.indexOf(userrole) !=-1 ) {

                      next();

                    } else {

                      return next({status:403, message:`No roles specified for user`});

                    }

                  } catch (err) {

                    next(err);

                  } finally {



                  }

  }

  }




  module.exports = permit;

//middileware
const roles = {
    "CLIENT": { VIEW_ROLE: ["novigo-admin", "client_view"], EDIT_ROLE: ["novigo-admin"] },

    "CONTRACTOR": { VIEW_ROLE: ["novigo-admin", "resource"], EDIT_ROLE: ["novigo-admin"] },
    "PROJECT": { VIEW_ROLE: ["novigo-admin", "resource"], EDIT_ROLE: ["novigo-admin"] },
    "Project-Resource": { VIEW_ROLE: ["novigo-admin", "resource"], EDIT_ROLE: ["novigo-admin"] },
    "RESOURCE": { VIEW_ROLE: ["novigo-admin", "resource"], EDIT_ROLE: ["novigo-admin"] },
    "ROLE": { VIEW_ROLE: ["novigo-admin", "resource"], EDIT_ROLE: ["novigo-admin"] },
    "TENANTS": { VIEW_ROLE: ["novigo-admin", "resource"], EDIT_ROLE: ["novigo-admin"] }
}
module.exports = roles;