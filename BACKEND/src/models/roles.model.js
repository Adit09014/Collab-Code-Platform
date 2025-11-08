import mongoose from "mongoose"

const roleSchema = new mongoose.Schema({
 name: {
  type: String,
  required: true
 },
 permissions: [{
  type: String,
  enum: [
   "read",
   "write",
   "manage_messages",
   "manage_roles",
   "manage_server",
   "kick_members",
   "invite_members"
  ]
 }],
 server: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Server",
  required: true
 }
})

const Role = mongoose.model("Role", roleSchema)
export default Role
