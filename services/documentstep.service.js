import { DocumentsStep } from '../models/documentsstep.model.js';

export const documentStepService = async ({ documents, termsAndConditions, user }) => {
  if (!user) throw new Error("User ID is required");

  const newDocStep = await DocumentsStep.create({
    documents,
    termsAndConditions,
    user,
  });

  return newDocStep;
};
