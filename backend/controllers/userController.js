const userModel = require('../models/User')
const serviceModel = require('../models/Service')
const portfolioModel = require('../models/Portfolio');

//Create New Service
module.exports.createService = async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await userModel.findById(userId);
    
    const { title, description, category, price, priceType, availableSlots } = req.body;

    // Validation check
    if (!title || !description || !category || !price || !priceType) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    // New service object create
    const newService = await serviceModel.create({
      artist: userId,
      title,
      description,
      category,
      price,
      priceType,
      availableSlots
    });
user.services.push(newService._id);
await user.save();

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      
    });

  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

//Create Portfolio
module.exports.createPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);


    //check Portfolio allready created (only one portfolio)
    if(user.portfolio)
      return res.status(400).json({ success: false, message: "Portfolio allready created" });

    const { title, description, images, mediaUrl, projectType, caseStudy } = req.body;

    if (!title || !description || !projectType || !caseStudy) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newPortfolio = await portfolioModel.create({
      artist: userId,
      title,
      description,
      mediaUrl,
      projectType,
      caseStudy
    });
user.portfolio = newPortfolio._id;
await user.save();

    return res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
    });

  } catch (error) {
    console.error("Error creating portfolio:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

//Edit / Update Service
module.exports.updateService = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const updates = req.body;

    // Service find karo
    let service = await serviceModel.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // Check if current user is the owner
    if (service.artist.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this service" });
    }

    // Update fields
    service = await serviceModel.findByIdAndUpdate(id, updates, { new: true });

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      // data: service
    });

  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Service
module.exports.deleteService = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // service id from URL
    const user = await userModel.findById(userId);

    const service = await serviceModel.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // Check if current user is the owner
    if (service.artist.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this service" });
    }

    await serviceModel.findByIdAndDelete(id);

    user.services.pull(id);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//Edit / Update Portfolio
module.exports.updatePortfolio = async (req, res) => {
  try {
    const userId = req.user._id
    const { id } = req.params; // portfolio id
    const updates = req.body;

    // Portfolio find
    let portfolio = await portfolioModel.findById(id);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }

    // Check if current user is the owner
    if (portfolio.artist.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this portfolio" });
    }

    // Update
    await portfolioModel.findByIdAndUpdate(id, updates, { new: true });

    return res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
    });

  } catch (error) {
    console.error("Error updating portfolio:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Portfolio
module.exports.deletePortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const user = await userModel.findById(userId);

    const portfolio = await portfolioModel.findById(id);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }

    // Check ownership
    if (portfolio.artist.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this portfolio" });
    }

    await portfolioModel.findByIdAndDelete(id);
    user.portfolio = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Portfolio deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
