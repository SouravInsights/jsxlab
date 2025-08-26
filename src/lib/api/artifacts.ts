/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ArtifactResponse {
  artifact: {
    id: string;
    type: string;
    name: string;
    code: string;
    meta: any;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ArtifactsListResponse {
  artifacts: ArtifactResponse["artifact"][];
}

export interface VersionResponse {
  version: {
    id: string;
    artifactId: string;
    version: number;
    code: string;
    meta: any;
    createdAt: string;
  };
}

export interface VersionsListResponse {
  versions: VersionResponse["version"][];
}

const baseUrl = "/api/artifacts";

// Helper function for handling fetch responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }
  return response.json();
};

// List all artifacts
export const getAllArtifacts = async (): Promise<
  ArtifactResponse["artifact"][]
> => {
  const response = await fetch(baseUrl);
  const data: ArtifactsListResponse = await handleResponse(response);
  return data.artifacts;
};

// Get specific artifact
export const getArtifactById = async (
  id: string
): Promise<ArtifactResponse["artifact"]> => {
  const response = await fetch(`${baseUrl}/${id}`);
  const data: ArtifactResponse = await handleResponse(response);
  return data.artifact;
};

// Create new artifact
export const createArtifact = async (artifact: {
  type: string;
  name: string;
  code: string;
  meta?: any;
}): Promise<ArtifactResponse["artifact"]> => {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(artifact),
  });
  const data: ArtifactResponse = await handleResponse(response);
  return data.artifact;
};

// Update artifact
export const updateArtifact = async (
  id: string,
  updates: {
    type?: string;
    name?: string;
    code?: string;
    meta?: any;
  }
): Promise<ArtifactResponse["artifact"]> => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const data: ArtifactResponse = await handleResponse(response);
  return data.artifact;
};

// Delete artifact
export const deleteArtifact = async (id: string): Promise<void> => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete artifact: ${response.statusText}`);
  }
};

// Get artifact versions
export const getArtifactVersions = async (
  artifactId: string
): Promise<VersionResponse["version"][]> => {
  const response = await fetch(`${baseUrl}/${artifactId}/versions`);
  const data: VersionsListResponse = await handleResponse(response);
  return data.versions;
};

// Get specific version
export const getArtifactVersion = async (
  artifactId: string,
  version: number
): Promise<VersionResponse["version"]> => {
  const response = await fetch(`${baseUrl}/${artifactId}/versions/${version}`);
  const data: VersionResponse = await handleResponse(response);
  return data.version;
};

export const ArtifactsAPI = {
  getAll: getAllArtifacts,
  getById: getArtifactById,
  create: createArtifact,
  update: updateArtifact,
  delete: deleteArtifact,
  getVersions: getArtifactVersions,
  getVersion: getArtifactVersion,
} as const;
