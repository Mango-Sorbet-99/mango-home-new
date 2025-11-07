module.exports = function deepPopulate(uid, depth = 5) {
  const model = strapi.getModel(uid)
  const out = {}
  if (!model?.attributes || depth <= 0) return out

  for (const [key, attr] of Object.entries(model.attributes)) {
    if (attr.type === 'media') {
      out[key] = true
    }

    if (attr.type === 'relation') {
      out[key] = {
        populate: deepPopulate(attr.target, depth - 1)
      }
    }

    if (attr.type === 'component') {
      out[key] = {
        populate: deepPopulate(attr.component, depth - 1)
      }
    }

    if (attr.type === 'dynamiczone') {
      out[key] = {
        populate: attr.components.reduce((acc, c) => {
          acc[c] = {
            populate: deepPopulate(c, depth - 1)
          }
          return acc
        }, {})
      }
    }
  }

  return out
}
