const PetRoutes = require("express").Router();
const { authorize } = require("../../middlewares/auth");
const upload = require("../../middlewares/file")

const { getAllPets, register, login, petById, update, remove } = require("./pet.controller");

PetRoutes.get('/', [authorize], getAllPets);
PetRoutes.post('/register', upload.single("avatar"), register);
PetRoutes.post('/login', login);
PetRoutes.get('/:id', [authorize], petById);
PetRoutes.patch('/:id', [authorize], update);
PetRoutes.delete('/:id', [authorize], remove);

module.exports = PetRoutes;