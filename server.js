const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// Schema
const schema = buildSchema(`
  type Libro {
    id: ID!
    titulo: String!
    autor: String!
    ciudadPublicacion: String!
    disponible: Boolean!
  }

  type Query {
    obtenerLibros: [Libro]
    buscarLibroPorCiudad(ciudad: String!): [Libro]
    libroPorId(id: ID!): Libro
  }

  type Mutation {
    agregarLibro(titulo: String!, autor: String!, ciudadPublicacion: String!): Libro
    actualizarDisponibilidad(id: ID!, disponible: Boolean!): Libro
  }
`);

// Datos iniciales
let libros = [
  { id: "1", titulo: "El Jardín de los Secretos", autor: "Laura Torres", ciudadPublicacion: "Tunja", disponible: true },
  { id: "2", titulo: "Sombras del Ayer", autor: "Carlos Méndez", ciudadPublicacion: "Bogotá", disponible: false },
  { id: "3", titulo: "Historias del Puente Viejo", autor: "Mariana López", ciudadPublicacion: "Medellín", disponible: true },
];

// Resolvers
const root = {
  obtenerLibros: () => libros,
  buscarLibroPorCiudad: ({ ciudad }) => libros.filter(libro => libro.ciudadPublicacion === ciudad),
  libroPorId: ({ id }) => libros.find(libro => libro.id === id),
  agregarLibro: ({ titulo, autor, ciudadPublicacion }) => {
    const nuevoLibro = { id: String(libros.length + 1), titulo, autor, ciudadPublicacion, disponible: true };
    libros.push(nuevoLibro);
    return nuevoLibro;
  },
  actualizarDisponibilidad: ({ id, disponible }) => {
    const libro = libros.find(l => l.id === id);
    if (libro) libro.disponible = disponible;
    return libro;
  },
};

// Servidor
const app = express();
app.use("/graphql", graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,  // <--- Habilita GraphiQL
}));

const PORT = 3033;
app.listen(PORT, () => {
  console.log(`Servidor GraphQL corriendo en http://localhost:${PORT}/graphql`);
});

