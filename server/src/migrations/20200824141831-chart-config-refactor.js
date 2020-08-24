'use strict';

module.exports = {
  up: async queryInterface => {
    // Update config object that contain xAxis values
    await queryInterface.sequelize.query(
      `UPDATE charts
       SET
         config = JSON_INSERT(
                    config,
                    "$.axis1", JSON_OBJECT(
                                  "label", IF(JSON_EXTRACT(config, "$.xAxis_Label") IS NOT NULL, JSON_EXTRACT(config, "$.xAxis_Label"), NULL),
                                  "value", JSON_EXTRACT(config, "$.xAxis")
                                ),
                    "$.axis2", JSON_OBJECT(
                                  "label", IF(JSON_EXTRACT(config, "$.yAxis_Label") IS NOT NULL, JSON_EXTRACT(config, "$.yAxis_Label"), NULL),
                                  "value", JSON_EXTRACT(config, "$.yAxis")
                                )
                  )
       WHERE
         JSON_EXTRACT(config, "$.type") IN ("bar", "line", "heatmap");
      `,
    );

    // Update config object that contain name/value values
    await queryInterface.sequelize.query(
      `UPDATE charts
       SET
         config = JSON_INSERT(
                    config,
                    "$.axis1", JSON_OBJECT(
                                  "label", IF(JSON_EXTRACT(config, "$.name_Label") IS NOT NULL, JSON_EXTRACT(config, "$.name_Label"), NULL),
                                  "value", JSON_EXTRACT(config, "$.name")
                                ),
                    "$.axis2", JSON_OBJECT(
                                  "label", IF(JSON_EXTRACT(config, "$.value_Label") IS NOT NULL, JSON_EXTRACT(config, "$.value_Label"), NULL),
                                  "value", JSON_EXTRACT(config, "$.value")
                                )
                  )
       WHERE
         JSON_EXTRACT(config, "$.type") = "pie";
      `,
    );

    // Remove old keys
    await queryInterface.sequelize.query(
      `UPDATE charts
       SET
         config = JSON_REMOVE(config,
                    "$.xAxis",
                    "$.xAxis_Label",
                    "$.yAxis",
                    "$.yAxis_Label",
                    "$.name",
                    "$.name_Label",
                    "$.value",
                    "$.value_Label"
                  )
       WHERE
         JSON_EXTRACT(config, "$.type") IN ("bar", "line", "pie", "heatmap");
      `,
    );

    return;
  },

  down: async queryInterface => {
    // Un-nest axis keys and return them to individual keys within main config object
    await queryInterface.sequelize.query(
      `UPDATE charts
       SET
         config = JSON_INSERT(config,
                    "$.xAxis", JSON_EXTRACT(config, "$.axis1.value"),
                    "$.xAxis_Label", JSON_EXTRACT(config, "$.axis1.label"),
                    "$.yAxis", JSON_EXTRACT(config, "$.axis2.value"),
                    "$.yAxis_Label", JSON_EXTRACT(config, "$.axis2.label")
                  )
      WHERE
         JSON_EXTRACT(config, "$.type") IN ("bar", "line", "heatmap");
      `,
    );

    await queryInterface.sequelize.query(
      `UPDATE charts
       SET
         config = JSON_INSERT(config,
                    "$.name", JSON_EXTRACT(config, "$.axis1.value"),
                    "$.name_Label", JSON_EXTRACT(config, "$.axis1.label"),
                    "$.value", JSON_EXTRACT(config, "$.axis2.value"),
                    "$.value_Label", JSON_EXTRACT(config, "$.axis2.label")
                  )
      WHERE
         JSON_EXTRACT(config, "$.type") = "pie";
      `,
    );

    // Remove old keys
    await queryInterface.sequelize.query(
      `UPDATE charts
       SET
         config = JSON_REMOVE(config, "$.axis1", "$.axis2")
       WHERE
         JSON_EXTRACT(config, "$.type") IN ("bar", "line", "pie", "heatmap");
      `,
    );

    return;
  },
};
