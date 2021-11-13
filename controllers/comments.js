const { comment, events, users } = require("../models");

class Comment {
  // Get all comment
  async getAllComment(req, res, next) {
    try {
      let data = await comment.findAll({
        // find all data in table comment
        attributes: {
          exclude: ["id_event", "id_user", "updatedAt"],
        },
      });
      // if there is no data in comment
      if (data.length === 0) {
        return res.status(404).json({ errors: ["Comment not found"] });
      }
      // if success
      res.status(200).json({ data });
    } catch (error) {
      // if error
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }
  // get detail comment
  async getDetailComment(req, res, next) {
    try {
      let data = await comment.findOne({
        // find all data in comment table
        where: { id: req.params.id },
        attributes: {
          exclude: ["id_event", "id_user", "updatedAt"],
        },
      });

      // if there is no data
      if (!data) {
        return res.status(404).json({ errors: ["Comment not found"] });
      }

      // if success
      res.status(200).json({ data });
    } catch (error) {
      // if error
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }
  // Create comment
  async createComment(req, res, next) {
    try {
      // create comment
      const newData = await comment.create(req.body);

      // find event with join
      const data = await comment.findOne({
        where: {
          id: newData.id,
        },
        attributes: {
          exclude: ["id_event", "id_user", "updatedAt"],
        },
      });

      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }

  // Update data
  async updateComment(req, res, next) {
    try {
      // transaction table update data
      const updatedData = await transaction.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      // If no data updated
      if (updatedData[0] === 0) {
        return res.status(404).json({ errors: ["Comment not found"] });
      }
      // find the updated comment
      const data = await comment.findOne({
        where: {
          id: req.params.id,
        },
        attributes: {
          exclude: ["id_event", "id_user", "updatedAt"],
        },
      });
      // if success
      res.status(201).json({ data });
    } catch (error) {
      // if error
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }

  // Delete data
  async deleteComment(req, res, next) {
    try {
      // delete data
      let data = await comment.destroy({ where: { id: req.params.id } });
      // if delete data is null
      if (!data) {
        return res.status(404).json({ errors: ["Comment not found"] });
      }

      // if success
      res.status(200).json({ message: "Success delete comment" });
    } catch (error) {
      // if error
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new Comment();
