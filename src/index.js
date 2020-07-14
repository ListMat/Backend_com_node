const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();
app.use(express.json());

/**
 * Métodos HTTP:
 *
 * GET: Buscar informações do Backend
 * POST: Criar uma informação no Backend
 * PUT/PATCH: Alterar uma informação no Backend
 * DELETE: Deletar uma informação no Backend
 *
 * */

/**
 * Tipos de parámetros:
 *
 * Query Params: Filtar e paginação
 * Route Params: Identificar recursos (Altear/Deletar)
 * Request Body: Conteúdo na hora de Criar ou editar um recurso (JSON)
 *
 * */

/**
 * Middlewares:
 *
 * Interceptador de requisições que interromper totalmente a requisição ou pode
 * alterar dados da requisição
 *
 * */
const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log("1");
  console.time(logLabel);
  next(); // Proximo middleware
  console.log("2");

  console.timeEnd(logLabel);
}

function validateProjectID(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID" });
  }
  return next();
}

app.use(logRequests);
app.use("/projects/:id", validateProjectID);
app.get("/project", (request, response) => {
  console.log("3");

  const { title } = request.query;

  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;
  return response.json(results);
});
app.post("/project", (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid, title, owner };

  projects.push(project);

  return response.json(project);
});

app.put("/project/:id", (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  // Posição do meu objeto dentro do meu vetor
  // Position of my object within my vector
  const projectIndex = projects.findIndex((project) => project.id === id);
  // Validação simples
  // Simple validation
  if (projectIndex < 0) {
    return response.status(400).json({ error: "project not found." });
  }
  // Criar uma nova informação de objeto do projeto
  // Create a new project object information
  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;
  return response.json(project);
});
app.delete("/project/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return response.status(400).json({ error: "project not found." });
  }
  projects.splice(projectIndex, 1);
  return response.status(204).send();
});

app.listen(3333, () => {
  console.log("Backend Started! ❤");
});
