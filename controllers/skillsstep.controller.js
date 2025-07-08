import { skillsStepService } from '../services/skillsstep.service.js';

export const skillsStepUser = async (req, res) => {
  const { user } = req.body;
  
  if (!user || !user.certificate || !user.skills || !user.schedule) {
    return res.status(400).json({ 
      message: 'Invalid data structure. Expected user object with certificate, skills, and schedule.' 
    });
  }

  try {
    const result = await skillsStepService({ 
      certificate: user.certificate, 
      skills: user.skills, 
      schedule: user.schedule 
    });

    res.status(201).json({
      id: result.id,
      message: 'Skills step saved successfully',
      user: {
        certificate: result.certificate,
        skills: result.skills,
        schedule: result.schedule
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
