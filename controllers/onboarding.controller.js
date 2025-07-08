import { personalInfoService, submitCompleteApplication } from '../services/onboarding.service.js';

export const personalInfoUser = async (req, res) => {
  const { fullname, age, gender } = req.body;

  try {
    const user = await personalInfoService({ fullname, age, gender });

    res.status(201).json({
      success: true,
      data: user,
      message: 'Personal info saved successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const submitApplication = async (req, res) => {
  try {
    const result = await submitCompleteApplication(req.body);
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit application'
    });
  }
};

