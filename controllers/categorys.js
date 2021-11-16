const { category } = require("../models");

class Categorys {
  async getAllCategory(req, res, next) {
    try {
      // get all data of list Category
      let data = await category.findAll({
        // where: { id_user: req.userData.id },
        attributes: {
          exclude: ["createdAt", "updatedAt", 'deletedAt'],
        },
      });

      // if there is no data in category
      if (data.length === 0) {
        return next({
          message: "There is no data from Category you search",
          statusCode: 404,
        });
      }

      //if there is data in tabel

      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }

  async getOneCategory(req, res, next) {
    try {
      // Get one data of list Category
      let data = await category.findOne({
        where: { id: req.params.id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      // If data of Category not found
      if (!data) {
        return next({
          message: "Category you search not found",
          statusCode: 404,
        });
      }

      // If found the data

      res.status(200).json({ data });
    } catch (error) {
      // if error
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }
  async createCategory(req, res, next) {
    try {
      // Create data Category
      // if (req.userData.id == req.body.id_user) {
      const insertData = await category.create(req.body);
      const data = await category.findOne({
        where: { id: insertData.id },
      });

      // Send data of inserted data
      res.status(201).json({ data });
      // } else {
      //   return next({ message: " id user not correct", statusCode: 404 });
      // }
    } catch (error) {
      // if error
      console.log(error);
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }
  async updateCategory(req, res, next) {
    try {
      // Update data category
      const updateData = await category.update(req.body, {
        where: { id: req.params.id },
      });

      // If no data updated
      if (updateData[0] === 0) {
        return res.status(404).json({ errors: ["Category not found"] });
      }

      // Find the updated data of task
      const data = await category.findOne({
        where: { id: req.params.id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      // Send data of inserted data

      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }
  async deleteCategory(req, res, next) {
    try {
      // Delete data
      let data = await category.destroy({
        where: { id: req.params.id },
      });

      // If data deleted is null
      if (!data) {
        return res.status(404).json({ errors: ["Category not found"] });
      }

      // If success
      res.status(200).json({ message: "Success delete Category" });
    } catch (error) {
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new Categorys();
