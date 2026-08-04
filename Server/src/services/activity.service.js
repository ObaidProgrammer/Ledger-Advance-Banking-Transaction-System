const activityLogModel = require("../models/activityLog.model");

async function createActivity({
    user,
    action,
    entity,
    entityId = null,
    description,
    metadata = {}
}) {

    return await activityLogModel.create({
        user,
        action,
        entity,
        entityId,
        description,
        metadata
    });

}

module.exports = {

    createActivity

};
