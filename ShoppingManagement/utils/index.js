const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const axios = require('axios')
require("dotenv").config()

//Utility functions
module.exports.GenerateSalt = async() => {
        return await bcrypt.genSalt()    
},

module.exports.GeneratePassword = async (password, salt) => {
        return await bcrypt.hash(password, salt);     
};


module.exports.ValidatePassword = async (enteredPassword, savedPassword, salt) => {
        return await this.GeneratePassword(enteredPassword, salt) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
        return await jwt.sign(payload, process.env.APP_SECRET, { expiresIn: '1d'} )
}, 

module.exports.ValidateSignature  = async(req) => {
        const signature = req.get('Authorization');
        console.log(signature);
        if(signature){
            const payload = await jwt.verify(signature.split(' ')[1], process.env.APP_SECRET);
            req.user = payload;
            return true;
        }
        return false
};

module.exports.validate = (schema) => (req, res, next) => {
        const validSchema = pick(schema, ["params", "query", "body", "headers"]);
        const object = pick(req, Object.keys(validSchema));
        const { value, error } = Joi.compile(validSchema)
          .prefs({ errors: { label: "key" } })
          .validate(object);
      
        if (error) {
            console.log("something happened here")
            console.log(error)
            console.log('done here')
          const errorCode = error.code || 500
          const errorMessage = error.details
            .map((details) => details.message)
            .join(", "); 
            
            return res.status(errorCode).send({
              message: `${errorMessage}`,
          })
          //return next(new ApiError(400, errorMessage));
        }
        Object.assign(req, value);
        return next();
};

module.exports.FormateData = (data) => {
        if(data){
                return { data }
        }else{
                throw new Error('Data Not found!')
        }
}

module.exports.PublishCustomerEvent = async (payload) => {
        axios.post('http://localhost:8000/app-events', { payload })
}