import swaggerAutogen from 'swagger-autogen'
import 'dotenv/config'

const outputFile = 'swagger.json'
const endpointsFiles = ['./src/application/server.ts']

const route = {
  info: {
    title: 'Exemplo de App',
    description: 'Description'
  },
  host: `localhost:${process.env.PORT}`,
  schemes: ['http']
  /* basePath: "/api/v1/" */
}

swaggerAutogen()(outputFile, endpointsFiles, route).then(data => {
  console.log('swagger file generated successfully')
  // console.log(data)
})
