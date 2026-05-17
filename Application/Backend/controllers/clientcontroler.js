import Client from "../models/Clientmodal.js";

const createclient = async (request, response) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized: User ID not found",
      });
    }
    const client = await Client.create({
      ...request.body,
      createdBy: userId,
    });
    response.status(201).json(client);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

export { createclient };

//get all clients

export const getAllclients = async (request, response) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized: User ID not found",
        data: null,
      });
    }
    // Find clients created by user OR legacy clients without createdBy
    const clients = await Client.find({
      $or: [
        { createdBy: userId },
        { createdBy: null },
        { createdBy: { $exists: false } },
      ],
    });
    response.status(200).json({
      success: true,
      error: false,
      message: "Clients fetched successfully",
      data: clients,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching clients",
      data: null,
    });
  }
};

//get client by id

export const getSingleClient = async (request, response) => {
  try {
    const client = await Client.findById(request.params.id);
    if (!client) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Client not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Client fetched successfully",
      data: client,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching client",
    });
  }
};

//update client

export const updateClient = async (request, response) => {
  try {
    const userId = request.userId;
    const clientId = request.params.id;

    // Verify the client belongs to the current user
    const existingClient = await Client.findById(clientId);
    if (!existingClient) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Client not found",
      });
    }

    // Check if user owns this client (with backward compatibility for legacy data)
    if (
      existingClient.createdBy &&
      existingClient.createdBy.toString() !== userId.toString()
    ) {
      return response.status(403).json({
        success: false,
        error: true,
        message: "Unauthorized: You can only update your own clients",
      });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { ...request.body, createdBy: userId },
      { new: true },
    );

    response.status(200).json({
      success: true,
      error: false,
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error updating client",
    });
  }
};

//delete client

export const deleteClient = async (request, response) => {
  try {
    const userId = request.userId;
    const clientId = request.params.id;

    // Verify the client belongs to the current user
    const existingClient = await Client.findById(clientId);
    if (!existingClient) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Client not found",
      });
    }

    // Check if user owns this client (with backward compatibility)
    if (
      existingClient.createdBy &&
      existingClient.createdBy.toString() !== userId.toString()
    ) {
      return response.status(403).json({
        success: false,
        error: true,
        message: "Unauthorized: You can only delete your own clients",
      });
    }

    const deletedClient = await Client.findByIdAndDelete(clientId);

    response.status(200).json({
      success: true,
      error: false,
      message: "Client deleted successfully",
      data: deletedClient,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting client",
    });
  }
};
