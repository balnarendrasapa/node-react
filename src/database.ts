import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('chat-doc', 'root', 'my-secret-pw', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
});

export const FileTable = sequelize.define('File', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  guid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  fileData: {
    type: DataTypes.BLOB('long'),
    allowNull: false,
  },
});

FileTable.sync({ force: true })
  .then(() => {
    console.log('File table has been created.');
  })
  .catch(console.error);

module.exports = FileTable;
