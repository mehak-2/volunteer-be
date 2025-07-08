import { ContactStep } from '../models/contactstep.model.js';

export const contactStepService = async ({ phone, email, address, location, contactPreference }) => {
  try {
    const contactStep = new ContactStep({
      phone,
      email,
      address: address || '',
      location: location ? JSON.parse(location) : null,
      contactPreference: contactPreference || 'email'
    });

    await contactStep.save();
    return contactStep;
  } catch (error) {
    console.error('Error in contactStepService:', error);
    throw error;
  }
};