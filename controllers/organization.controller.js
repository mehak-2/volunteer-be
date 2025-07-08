import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Organization from '../models/organization.model.js';
import Program from '../models/program.model.js';
import { Volunteer } from '../models/volunteer.model.js';

export const organizationRegister = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      description, 
      website, 
      phone, 
      address, 
      registrationNumber,
      contact 
    } = req.body;

    const existingOrg = await Organization.findOne({ email });
    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: "Organization already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const organization = await Organization.create({
      name,
      email,
      password: hashedPassword,
      description,
      website,
      phone,
      address,
      registrationNumber,
      contact,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: {
        organization: {
          id: organization._id,
          email: organization.email,
          name: organization.name,
          status: organization.status
        }
      },
      message: 'Organization registered successfully. Awaiting admin approval.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const organizationLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const organization = await Organization.findOne({ email });
    if (!organization) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    if (organization.status !== 'approved') {
      return res.status(401).json({
        success: false,
        message: "Organization not approved. Please wait for admin approval."
      });
    }

    const isMatch = await bcrypt.compare(password, organization.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: organization._id, role: 'organization' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      data: {
        organization: {
          id: organization._id,
          email: organization.email,
          name: organization.name,
          role: 'organization'
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getOrganizationDashboard = async (req, res) => {
  try {
    const organizationId = req.organization.id;

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }

    const programs = await Program.find({ organization: organizationId })
      .populate('appliedVolunteers.volunteer', 'personalInfo contactInfo skills status')
      .populate('selectedVolunteers', 'personalInfo contactInfo skills');

    const stats = {
      totalPrograms: programs.length,
      activePrograms: programs.filter(p => p.status === 'published' || p.status === 'in-progress').length,
      completedPrograms: programs.filter(p => p.status === 'completed').length,
      totalApplications: programs.reduce((acc, program) => acc + program.appliedVolunteers.length, 0),
      selectedVolunteers: programs.reduce((acc, program) => acc + program.selectedVolunteers.length, 0),
    };

    res.status(200).json({
      success: true,
      data: {
        organization: {
          id: organization._id,
          name: organization.name,
          email: organization.email,
          description: organization.description,
          website: organization.website,
          phone: organization.phone,
          address: organization.address,
          logo: organization.logo,
          status: organization.status,
        },
        programs,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createProgram = async (req, res) => {
  try {
    const organizationId = req.organization.id;
    const programData = { ...req.body, organization: organizationId };

    const program = await Program.create(programData);

    res.status(201).json({
      success: true,
      data: program,
      message: 'Program created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getPrograms = async (req, res) => {
  try {
    const organizationId = req.organization.id;
    const { status, category } = req.query;

    let filter = { organization: organizationId };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const programs = await Program.find(filter)
      .populate('appliedVolunteers.volunteer', 'personalInfo contactInfo skills status')
      .populate('selectedVolunteers', 'personalInfo contactInfo skills')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: programs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getVolunteersForProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const organizationId = req.organization.id;

    const program = await Program.findOne({ 
      _id: programId, 
      organization: organizationId 
    }).populate('appliedVolunteers.volunteer', 'personalInfo contactInfo skills status emergency');

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        program: {
          id: program._id,
          title: program.title,
          appliedVolunteers: program.appliedVolunteers
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const selectVolunteersForProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const { volunteerIds } = req.body;
    const organizationId = req.organization.id;

    const program = await Program.findOne({ 
      _id: programId, 
      organization: organizationId 
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found"
      });
    }

    program.selectedVolunteers = volunteerIds;
    program.currentVolunteers = volunteerIds.length;

    volunteerIds.forEach(volunteerId => {
      const application = program.appliedVolunteers.find(
        app => app.volunteer.toString() === volunteerId
      );
      if (application) {
        application.status = 'accepted';
      }
    });

    program.appliedVolunteers.forEach(application => {
      if (!volunteerIds.includes(application.volunteer.toString())) {
        application.status = 'rejected';
      }
    });

    await program.save();

    res.status(200).json({
      success: true,
      data: program,
      message: 'Volunteers selected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const organizationId = req.organization.id;
    const updateData = req.body;

    const program = await Program.findOneAndUpdate(
      { _id: programId, organization: organizationId },
      updateData,
      { new: true }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found"
      });
    }

    res.status(200).json({
      success: true,
      data: program,
      message: 'Program updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const organizationId = req.organization.id;

    const program = await Program.findOneAndDelete({ 
      _id: programId, 
      organization: organizationId 
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found"
      });
    }

    res.status(200).json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 