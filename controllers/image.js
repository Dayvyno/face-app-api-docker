const dotenv = require('dotenv');
dotenv.config();


const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

// // This will be used by every Clarifai endpoint call.
const metadata = new grpc.Metadata();
metadata.set("authorization", process.env.NEW_API_TOKEN);


const handleApiCall = (req, res) => {

  const {input} = req.body
  // console.log(`IMAGE-URL: ${input}`)

  stub.PostModelOutputs(
    {
        model_id: "f76196b43bbd45c99b4f3cd8e8b40a8a",
        version_id: "5e026c5fae004ed4a83263ebaabec49e",  // This is optional. Defaults to the latest model version.
        inputs: [
            {data: {image: {url: input}}}
        ]
    },
    metadata,
    (err, response) => {
      if (response.status.code===10000){
        return res.json(response)
      }

      else if (err) {
        res.status(400).json("Image API call failed")
        throw new Error(err);
      }
      
      else if (response.status.code !== 10000) {
        res.status(400).json(`API key failed the code: ${response.status.code}`)
        throw new Error("Post model outputs failed, status: " + response.status.description);
      }
  }
  );
}

const imageHandler = (req, res, db)=>{
  const {id} = req.body;

  db('users').where({id}).increment({entries: 1}).returning('entries')
    .then(count=>{
      res.json(count[0])
    })
    .catch(err=>res.status(400).json(`Unable to get number of entries: ${err}`))
}

module.exports = {
  handleApiCall,
  imageHandler
}

