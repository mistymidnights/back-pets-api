const Pet = require("../api/pets/pet.model");
const { verifyToken } = require("../helpers/utils/token-action");
const { setError } = require("../helpers/utils/error");

const authorize = async (req, _res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return next(setError(401, "Unauthorize"));
    const parsedToken = token.replace("Bearer ", "");
    const validToken = verifyToken(parsedToken, process.env.JWT_SECRET);
    if (!validToken) return next(setError(401, "Unauthorize"));
    const pet = await Pet.findById(validToken.id);
    delete pet.password;
    req.pet = pet;
    next();
  } catch (error) {
    return next(setError(401, 'Unathorize'));
  }
}

module.exports = { authorize }