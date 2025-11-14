const deepPopulate = require('../../../utils/deepPopulate')

module.exports = {
  async full(ctx) {
    const populate = deepPopulate('api::global.global', 5)

    const data = await strapi.entityService.findMany(
      'api::global.global',
      { populate }
    )

    ctx.body = { data }
  }
}