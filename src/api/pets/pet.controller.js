const Pet = require('./pet.model');

const bcrypt = require("bcrypt");
const { createToken } = require("../../helpers/utils/token-action");
const { setError } = require("../../helpers/utils/error");

const getAllPets = async (req, res, next) => {
    try {
        const pets = await Pet.find()
        return res.status(200).json({
            message: 'All Pets',
            pets
        })
    } catch (error) {
        return next(setError(500, error.message | 'Failed recover all pets'));
    }
};

const petById = async (req, res, next) => {
    try {
        const { id } = req.params;
        //if (id != req.pet.id) return next(setError(403, "Forbidden"));
        const pet = await Pet.findById(id);
        if (!pet) return next(setError(404, "Pet not found"));
        return res.status(200).json(pet);
    } catch (error) {
        return next(setError(500, error.message || 'Failed recover Use'));
        }
};

const register = async (req, res, next) => {
    try {
        const newPet = new Pet(req.body);
        const emailExist = await Pet.findOne({ email: newPet.email });
        const petNameExist = await Pet.findOne({ petName: newPet.petName });
        if (emailExist || petNameExist) return next(setError(409, "this Email || Pet name already exist"));
        if(req.file) {
          newPet.avatar = req.file.path
        }
        const petInDb = await newPet.save();
        res.status(201).json(petInDb);
    } catch (error) {
        return next(setError(500, error.message || 'Failed create Pet'));
    }
};

const login = async (req, res, next) => {
    try {
      const petInDb = await Pet.findOne({ email: req.body.email });
      if (!petInDb) return next(setError(404, "Pet not found"));
      if (bcrypt.compareSync(req.body.password, petInDb.password)) {
        const token = createToken(petInDb._id, petInDb.email);
        return res.status(200).json({ petInDb, token })
      } else {
        return next(setError(401, "Invalid Password"));
      }
    } catch (error) {
      return next(setError(500, error.message || 'Unexpected error login'));
    }
}

const update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const pet = new Pet(req.body);
      pet._id = id;
      if(req.file) {
        pet.avatar = req.file.path
      }
      const updatedPet = await Pet.findByIdAndUpdate(id, pet);
      if (!updatedPet) return next(setError(404, 'Pet not found'));
      return res.status(201).json({
        message: 'Updated Pet',
        updatedPet
      })
  
    } catch (error) {
      return next(setError(500, error.message | 'Failed updated pet'));
    }
  }

const remove = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedPet = await Pet.findByIdAndDelete(id);
      if (!deletedPet) return next(setError(404, 'Pet not found'));
      return res.status(200).json({
        message: 'Delete Pet',
        deletedPet
      })
    } catch (error) {
      return next(setError(500, error.message | 'Failed deleted pet'));
    }
  }

  module.exports = { 
    getAllPets, 
    register, 
    login, 
    petById, 
    update, 
    remove };