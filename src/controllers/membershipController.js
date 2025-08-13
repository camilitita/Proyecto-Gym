import {
  getAllMembershipsService,
  getMembershipByUserIdService,
  updateMembershipService,
  deactivateMembershipService,
  checkMembershipStatusService,
  getMembershipByIdService,
  renewMembershipService
} from "../models/membershipsModel.js";
import handleResponse from "../utils/handleResponse.js";

// Obtener todas las membresías
export const getAllMemberships = async (req, res, next) => {
  try {
    const memberships = await getAllMembershipsService();
    handleResponse(res, 200, "Membresías obtenidas correctamente", memberships);
  } catch (err) {
    next(err);
  }
};

// Obtener membresía por ID de usuaria
export const getMembershipByUserId = async (req, res, next) => {
  try {
    const membership = await getMembershipByUserIdService(req.params.userId);
    if (!membership) return handleResponse(res, 404, "Membresía no encontrada");
    handleResponse(res, 200, "Membresía obtenida correctamente", membership);
  } catch (err) {
    next(err);
  }
};

// Actualizar membresía (ej. renovar fechas)
export const updateMembership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, is_active } = req.body;

    const today = new Date();
    const endDateObj = new Date(end_date);

    // Si la fecha de vencimiento ya pasó, la membresía se marca inactiva
    const activeStatus = endDateObj >= today;

    // Actualizar membresía con el is_active calculado
    const updated = await updateMembershipService(id, start_date, end_date, activeStatus);

    if (!updated) {
      return res.status(404).json({
        status: 404,
        message: "Membresía no encontrada",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Membresía actualizada con éxito",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Desactivar membresía manualmente (opcional)
export const deactivateMembership = async (req, res, next) => {
  try {
    const deactivated = await deactivateMembershipService(req.params.userId);
    if (!deactivated) return handleResponse(res, 404, "Membresía no encontrada");
    handleResponse(res, 200, "Membresía desactivada correctamente", deactivated);
  } catch (err) {
    next(err);
  }
};

// Verificar si una usuaria tiene una membresía activa (útil para el escaneo QR)
export const checkMembershipStatus = async (req, res, next) => {
  try {
    const status = await checkMembershipStatusService(req.params.userId);
    if (!status) return handleResponse(res, 404, "Membresía no válida o vencida");
    handleResponse(res, 200, "Membresía activa", status);
  } catch (err) {
    next(err);
  }
};

// Obtener membresía por su ID (la clave primaria de la tabla memberships)
export const getMembershipById = async (req, res, next) => {
  try {
    const { id } = req.params; // Obtener el ID de la membresía de los parámetros de la URL
    const membership = await getMembershipByIdService(id);
    if (!membership) {
      return handleResponse(res, 404, "Membresía no encontrada.");
    }
    handleResponse(res, 200, "Membresía obtenida correctamente.", membership);
  } catch (err) {
    next(err);
  }
};

export const renewMembership = async (req, res, next) => {
  try {
    const { id } = req.params;

    const renewed = await renewMembershipService(id);

    if (!renewed) {
      return handleResponse(res, 404, "Membresía no encontrada o ya activa.");
    }

    handleResponse(res, 200, "Membresía renovada exitosamente", renewed);
  } catch (error) {
    next(error);
  }
};