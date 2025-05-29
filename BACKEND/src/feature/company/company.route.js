import express from "express";
import CompanyController from "./company.controller.js";
import {
  companyCreateValidator,
  companyUpdateValidator,
  companyIdValidator,
} from "./company.validator.js";
import { authorize } from "../../middleware/auth.middleware.js";

const router = express.Router();
const companyController = new CompanyController();

// Routes accessible only to SUPERADMIN
router.post(
  "/",
  authorize(["SUPERADMIN"]),
  companyCreateValidator,
  companyController.createCompany.bind(companyController)
);

router.put(
  "/:id",
  authorize(["SUPERADMIN"]),
  companyUpdateValidator,
  companyController.updateCompany.bind(companyController)
);

router.delete(
  "/:id",
  authorize(["SUPERADMIN"]),
  companyIdValidator,
  companyController.deleteCompany.bind(companyController)
);

// Routes accessible to SUPERADMIN and STORE_ADMIN
router.get(
  "/",
  authorize(["SUPERADMIN", "STORE_ADMIN"]),
  companyController.getAllCompanies.bind(companyController)
);

router.get(
  "/:id",
  authorize(["SUPERADMIN", "STORE_ADMIN"]),
  companyIdValidator,
  companyController.getCompanyById.bind(companyController)
);

export default router;
