const { bookmark, events, users } = require("../models");

class Bookmark {
  // get all bookmark
  async getAllBookmark(req, res, next) {
    try {
      let data = await bookmark.findAll({
        // find all data in table bookmark
        attributes: {
          exclude: ["id_event", "id_user", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: events,
          },
          // {
          //   model: users,
          // },
        ],
      });

      // If there is nothing here
      if ((data, length === 0)) {
        return res.status(404).json({ errors: ["Bookmark not found"] });
      }
      // If success
      res.status(200).json({ data });
    } catch (error) {
      // if error
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }
  async getDetailBookmark(req, res, next) {
    try {
      let data = await bookmark.findOne({
        // find all data of bookmark table
        where: { id: req.params.id },
        attributes: {
          exclude: ["id_event", "id_user", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: events,
          },
          // {
          //   model: users,
          // },
        ],
      });

      // if theres nothing here
      if (!data) {
        return res.status(404).json({ errors: ["Bookmark is not found"] });
      }

      // if success
      res.status(200).json({ data });
    } catch (error) {
      // if error
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }

  async createBookmark(req, res, next) {
    try {
      // create bookmark
      const newData = await bookmark.create(req.body);

      // find bookmark with join
      const data = await bookmark.findOne({
        where: {
          id: newData.id,
        },
        attributes: {
          exclude: ["id_event", "id_user", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: events,
          },
          // {
          //   model: users,
          // },
        ],
      });
      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }

  // update data
  async updateBookmark(req, res, next) {
    try {
      // bookmark table update
      const updateData = await bookmark.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      // if no data updated
      if (updatedData[0] === 0) {
        return res.status(404).json({ errors: ["Bookmark not found"] });
      }

      // find the updated bookmark
      const data = await transaction.findOne({
        where: {
          id: req.params.id,
        },
        attributes: {
          exclude: ["id_event", "id_user", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: events,
          },
          // {
          //   model: users,
          // },
        ],
      });

      // if success
      res.status(201).json({ data });
    } catch (error) {
      // if error
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }

  // delete data
  async deleteBookmark(req, res, next) {
    try {
      // delete data
      let data = await bookmark.destroy({ where: { id: req.params.id } });

      // If data deleted is null
      if (!data) {
        return res.status(404).json({ errors: ["Bookmark not found"] });
      }

      // if success
      res.status(200).json({ message: "Success delete bookmark" });
    } catch (error) {
      // if error
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new Bookmark();
