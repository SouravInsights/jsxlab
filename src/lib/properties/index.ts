/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyRegistry } from "./registry";
import { corePlugins } from "./plugins";

// Export main types and registry
export { PropertyRegistry } from "./registry";
export type {
  PropertyPlugin,
  EditableProperty,
  PropertyExtractorConfig,
  PropertyRendererConfig,
  PropertyType,
  PropertyValue,
  PropertyUpdateContext,
} from "./types";

/**
 * Initialize the property system with core plugins
 */
export async function initializePropertySystem(): Promise<PropertyRegistry> {
  const registry = PropertyRegistry.getInstance();

  try {
    // Register all core plugins
    for (const plugin of corePlugins) {
      await registry.registerPlugin(plugin);
    }

    console.log("Property system initialized with core plugins");
    return registry;
  } catch (error) {
    console.error("Failed to initialize property system:", error);
    throw error;
  }
}

/**
 * Get the property registry instance (creates if not exists)
 */
export function getPropertyRegistry(): PropertyRegistry {
  return PropertyRegistry.getInstance();
}

/**
 * Helper to extract properties using the registry
 */
export function extractElementProperties(element: any) {
  const registry = getPropertyRegistry();
  return registry.extractProperties(element);
}

/**
 * Helper to get property renderer
 */
export function getPropertyRenderer(type: any) {
  const registry = getPropertyRegistry();
  return registry.getRenderer(type);
}

/**
 * Later I can make plugins auto-discover (e.g., via require.context or fs glob in Next.js build) so that adding a plugin file automatically registers it, without even updating plugins/index.ts
 */
