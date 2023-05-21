const userSchema = require('../../models/Users/userSchema')

exports.getUsers = async (req, res) => {
  try {
    userSchema.find().then((data) => {
      res.status(200).json(data);
    })
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
}

exports.blockUnblockUser = async (req, res) => {
  try {
    const result = await userSchema.findOne({ _id: req.query.id })
    await userSchema.updateOne({ _id: req.query.id }, { $set: { status: (!result.status) } })
    const data = await userSchema.find()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json('Internal Server Error')
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await userSchema.deleteOne({ _id: req.query.id })
    res.status(200).json('User deleted')
  } catch (err) {
    res.status(500).json('Internal Server Error')
  }
}


exports.searchUser = async (req, res) => {
  try {
    let username = req.body.searchkeyword;
    userSchema.find({
      $or: [
        { firstName: { $regex: ".*" + username + ".*", $options: "i" } },
        { lastName: { $regex: ".*" + username + ".*", $options: "i" } },
        { email: { $regex: ".*" + username + ".*", $options: "i" } },
      ]
    })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
