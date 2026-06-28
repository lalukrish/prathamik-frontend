import api from "@/lib/axios";

export const createOrganization = async (data: {
  organizationName: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}) => {
  try {
    const response = await api.post(
      "/admin/create-organization",
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
};

export const updateOrganization = async (
  organizationId: string,
  data: {
    organizationName: string;
    adminId: string;
    adminName: string;
    adminEmail: string;
    adminPassword?: string;
  }
) => {
  try {
    const response = await api.put(
      `/admin/organization/${organizationId}`,
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw error;
  }
};