const mongoose=require('mongoose');

const FileScheme= new mongoose.Schema({
    filename: {
        type:String ,
        required: true
    },
    content:{
        type:String,
        default:''
    }
})

const ProjectSchema=new mongoose.Schema({
    projectname:{
        type: String,
        required: true
    },
    description: String,
    files:[FileScheme],
    projectId: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
    }

})

const Project= mongoose.model('Project',ProjectSchema,'Projects');

module.exports=Project;