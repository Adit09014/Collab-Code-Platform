import Role from "../models/roles.model.js"
import Server from "../models/server.model.js"

export const addRole = async (req, res) => {
 try {
  const { serverId } = req.params
  const { name, permissions } = req.body

  if (!name) return res.status(400).json({ message: "Role name is required" })
  if (!Array.isArray(permissions))
   return res.status(400).json({ message: "Permissions must be an array" })

  
  const server = await Server.findById(serverId)
  if (!server) return res.status(404).json({ message: "Server not found" })

  
  const existingRole = await Role.findOne({ server: serverId, name })
  if (existingRole)
   return res.status(400).json({ message: "Role with this name already exists" })

  
  const newRole = await Role.create({
   name,
   permissions,
   server: serverId
  })

  
  server.roles.push(newRole._id)
  await server.save()

  res.status(201).json({
   message: "Role added successfully",
   role: newRole
  })
 } catch (err) {
  console.log("Error in addRole:", err.message)
  res.status(500).json({ message: "Internal Server Error" })
 }
}

