const createTablePK = DataTypes => ({
  allowNull: false,
  autoIncrement: false,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
  type: DataTypes.UUID,
});

const createString = (DataTypes, stringLength, optional = false) => ({
  allowNull: optional,
  type: DataTypes.STRING(stringLength),
});

const createNumber = (DataTypes, optional = false) => ({
  allowNull: optional,
  type: DataTypes.INTEGER,
});

const createJsonObject = DataTypes => ({
  allowNull: false,
  defaultValue: {},
  type: DataTypes.JSON,
});

const createJsonArray = DataTypes => ({
  allowNull: false,
  defaultValue: [],
  type: DataTypes.JSON,
});

const createFKField = (DataTypes, optional = false) => ({
  allowNull: optional,
  type: DataTypes.UUID,
});

const createDateTimeStamp = (DataTypes, optional = false) => ({
  allowNull: optional,
  type: DataTypes.DATE,
});

const createDateTimeStamps = DataTypes => ({
  createdAt: {
    ...createDateTimeStamp(DataTypes),
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    ...createDateTimeStamp(DataTypes),
    defaultValue: DataTypes.NOW,
  },
  deletedAt: createDateTimeStamp(DataTypes, true),
});

const generateConstraintName = (sourceTable, referenceTable, fields, type) => {
  let constraintName = `${type}_${sourceTable}_`;
  constraintName = constraintName += referenceTable ? `${referenceTable}_` : '';

  // Generate constraint name
  fields.forEach((field, index) => {
    if (index === fields.length - 1) {
      constraintName += `${field}`;
    } else {
      constraintName += `${field}_`;
    }
  });

  // Truncate to max name length
  constraintName = constraintName.length > 64 ? constraintName.slice(0, 63) : constraintName;

  return constraintName;
};

const createForeignKeyConstraint = (sourceTable, referenceTable, fields) => {
  const constraintName = generateConstraintName(sourceTable, referenceTable, fields, 'fk');

  return {
    fields,
    type: 'foreign key',
    name: constraintName,
    references: {
      table: referenceTable,
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  };
};

const createUniqueConstraint = (sourceTable, fields) => {
  const constraintName = generateConstraintName(sourceTable, null, fields, 'index');

  return { fields, type: 'unique', name: constraintName };
};

const removeFields = (fields, removeDateTimeStamps = true) => {
  let removedFields = fields;

  if (removeDateTimeStamps) {
    removedFields = [...removedFields, 'createdAt', 'updatedAt', 'deletedAt'];
  }

  return { attributes: { exclude: removedFields } };
};

const unNestSequelizeObj = sequelizeObj => {
  return sequelizeObj ? sequelizeObj.dataValues : null;
};

module.exports = {
  createTablePK,
  createString,
  createNumber,
  createJsonObject,
  createJsonArray,
  createFKField,
  createDateTimeStamps,
  createForeignKeyConstraint,
  createUniqueConstraint,
  generateConstraintName,
  removeFields,
  unNestSequelizeObj,
};
