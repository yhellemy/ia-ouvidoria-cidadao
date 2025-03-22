import pkg from './package.json'

export default defineNitroConfig({
  experimental: {
    openAPI: true,
  },
  openAPI: {
    route: '/_docs/openapi.json',
    production: 'prerender',
    meta: {
      title: 'ai-ouvidoria-cidadao',
      description: `Esta API foi desenvolvida para classificar mensagens de texto relacionadas a órgãos públicos do estado de Goiás, utilizando modelos de linguagem de Inteligência Artificial (IA).`,
      version: pkg.version,
    },
    ui: {
      scalar: {
        theme: 'purple',
        route: '/docs',
      },
      swagger: {
        route: '/swagger',
      },
    },
  },
})
