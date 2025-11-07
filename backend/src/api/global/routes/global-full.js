module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/global/full',
      handler: 'global.full',
      config: { auth: false }
    }
  ]
}
