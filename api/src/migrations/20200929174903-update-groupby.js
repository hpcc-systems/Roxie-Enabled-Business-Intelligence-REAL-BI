'use strict';

module.exports = {
  up: async queryInterface => {
    // Update config object to convert groupBy to object to contain value and type
    await queryInterface.sequelize.query(
      `UPDATE charts
       SET
         config = JSON_INSERT(
                    JSON_REMOVE(config, "$.groupBy"),
                    "$.groupBy", JSON_OBJECT(
                                    "type", "string",
                                    "value", JSON_UNQUOTE(
                                                IF(JSON_EXTRACT(config, "$.groupBy") IS NOT NULL AND JSON_EXTRACT(config, "$.groupBy") != "", JSON_EXTRACT(config, "$.groupBy"), "")
                                              )
                                 )
                  );
      `,
    );

    return;
  },

  down: async queryInterface => {
    // Un-nest groupBy value and add at root of config object
    await queryInterface.sequelize.query(
      `UPDATE charts
       SET
         config = JSON_INSERT(
                    JSON_REMOVE(config, "$.groupBy"),
                    "$.groupBy", JSON_EXTRACT(config, "$.groupBy.value")
                  );
      `,
    );

    return;
  },
};
