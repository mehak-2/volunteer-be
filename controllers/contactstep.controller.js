import { contactStepService } from '../services/contactstep.service.js';


export const contactStepUser = async (req, res) => {
  try {
    console.log("Received contact data:", req.body); // 👀 Add this line

    const { phone, email, address, location, contactPreference } = req.body;

    const contactStep = await contactStepService({
      phone,
      email,
      address,
      location,
      contactPreference
    });

    res.status(201).json({
      success: true,
      data: contactStep
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
