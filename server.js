const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

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

let libros = [
  { id: "1", titulo: "El Jardín de los Secretos", autor: "Laura Torres", ciudadPublicacion: "Tunja", disponible: true },
  { id: "2", titulo: "Sombras del Ayer", autor: "Carlos Méndez", ciudadPublicacion: "Bogotá", disponible: false },
  { id: "3", titulo: "Historias del Puente Viejo", autor: "Mariana López", ciudadPublicacion: "Medellín", disponible: true },
];

const root = {
  obtenerLibros: () => libros,
  buscarLibroPorCiudad: ({ ciudad }) =>
    libros.filter((l) => l.ciudadPublicacion.toLowerCase() === ciudad.toLowerCase()),
  libroPorId: ({ id }) => libros.find((l) => l.id === id),
  agregarLibro: ({ titulo, autor, ciudadPublicacion }) => {
    const nuevoLibro = {
      id: String(libros.length + 1),
      titulo,
      autor,
      ciudadPublicacion,
      disponible: true,
    };
    libros.push(nuevoLibro);
    return nuevoLibro;
  },
  actualizarDisponibilidad: ({ id, disponible }) => {
    const libro = libros.find((l) => l.id === id);
    if (!libro) throw new Error("Libro no encontrado");
    libro.disponible = disponible;
    return libro;
  },
};

const app = express();

app.use(
  "/biblioteca",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 3033;
app.listen(PORT, "0.0.0.0" ,() => {
  console.log(`Servidor GraphQL Biblioteca en http://0.0.0.0:${PORT}/biblioteca`);
});
