import Client from "../models/Clientmodal.js";
const createclient = async (request, response) => {
  try {
    const client = await Client.create(request.body);
    response.status(201).json(client);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export { createclient };

//get all clients
export const getAllclients = async (request, response) => {
  try {
    const clients = await Client.find();
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
    const updatedClient = await Client.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true },
    );
    if (!updatedClient) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Client not found",
      });
    }
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
    const deletedClient = await Client.findByIdAndDelete(request.params.id);
    if (!deletedClient) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Client not found",
      });
    }
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
