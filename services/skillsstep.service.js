import { SkillsStep } from '../models/skillsstep.model.js';

export const skillsStepService = async ({ certificate, skills, schedule, userId }) => {
  const newSkillsStep = new SkillsStep({
    certificate,
    skills,
    schedule,
    user: userId
  });

  const savedInfo = await newSkillsStep.save();

  return {
    id: savedInfo._id,
    certificate: savedInfo.certificate,
    skills: savedInfo.skills,
    schedule: savedInfo.schedule,
    userId: savedInfo.user
  };
};