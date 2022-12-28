const { Model, DataTypes, ValidationError } = require('sequelize')
const { sequelize } = require('../utils/db')

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        invalidYear(year) {
          const currentYear = new Date().getFullYear()

          if (year < 1991 || year > currentYear) {
            throw new ValidationError(
              `Given year ${year} is outside allowed range of [1991, ${currentYear}]`
            )
          }
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog',
  }
)

module.exports = Blog
