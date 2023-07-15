"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const school_validation_1 = require("../helper/validators/school.validation");
const school_controller_1 = require("../https/controllers/school.controller");
const router = express_1.default.Router();
// Register new school
router.post('/', school_validation_1.schoolRegistrationValidator, school_controller_1.registerSchool);
// Login new school
router.post('/login', school_validation_1.schoolLoginValidator, school_controller_1.loginSchool);
// Get all school
router.get('/', school_controller_1.getAllSchool);
// Get school profile
router
    .route('/profile/:id')
    .get(school_controller_1.getSchoolProfile)
    .put(school_validation_1.updateValidator, school_controller_1.updateSchoolProfile)
    .delete(school_controller_1.deleteSchoolProfile);
exports.default = router;
