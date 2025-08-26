import {
  PropertyPlugin,
  PropertyExtractorConfig,
  PropertyRendererConfig,
  EditableProperty,
  PropertyType,
  PropertyValue,
} from "./types";
import { ElementNode } from "../utils/types";

export class PropertyRegistry {
  private static instance: PropertyRegistry | null = null;

  private plugins: Map<string, PropertyPlugin> = new Map();
  private extractors: PropertyExtractorConfig[] = [];
  private renderers: Map<PropertyType, PropertyRendererConfig> = new Map();

  static getInstance(): PropertyRegistry {
    if (!PropertyRegistry.instance) {
      PropertyRegistry.instance = new PropertyRegistry();
    }
    return PropertyRegistry.instance;
  }

  /**
   * Register a property plugin
   */
  async registerPlugin(plugin: PropertyPlugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Property plugin '${plugin.id}' is already registered`);
      return;
    }

    try {
      // Initialize plugin if needed
      if (plugin.initialize) {
        await plugin.initialize();
      }

      // Register the plugin
      this.plugins.set(plugin.id, plugin);

      // Register extractors (sorted by priority)
      this.extractors.push(...plugin.extractors);
      this.extractors.sort((a, b) => (b.priority || 0) - (a.priority || 0));

      // Register renderers
      for (const renderer of plugin.renderers) {
        if (this.renderers.has(renderer.type)) {
          console.warn(
            `Property renderer for type '${renderer.type}' is already registered`
          );
          continue;
        }
        this.renderers.set(renderer.type, renderer);
      }

      console.log(
        `Registered property plugin: ${plugin.name} v${plugin.version}`
      );
    } catch (error) {
      console.error(`Failed to register plugin '${plugin.id}':`, error);
      throw error;
    }
  }

  /**
   * Unregister a property plugin
   */
  async unregisterPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.warn(`Property plugin '${pluginId}' is not registered`);
      return;
    }

    try {
      // Cleanup plugin if needed
      if (plugin.cleanup) {
        await plugin.cleanup();
      }

      // Remove extractors
      this.extractors = this.extractors.filter(
        (extractor) => !plugin.extractors.includes(extractor)
      );

      // Remove renderers
      for (const renderer of plugin.renderers) {
        this.renderers.delete(renderer.type);
      }

      // Remove plugin
      this.plugins.delete(pluginId);

      console.log(`Unregistered property plugin: ${plugin.name}`);
    } catch (error) {
      console.error(`Failed to unregister plugin '${pluginId}':`, error);
      throw error;
    }
  }

  /**
   * Extract all properties from an element
   */
  extractProperties(element: ElementNode): EditableProperty[] {
    const properties: EditableProperty[] = [];
    const seenKeys = new Set<string>();

    for (const extractor of this.extractors) {
      if (!extractor.canExtract(element)) {
        continue;
      }

      try {
        const property = extractor.extract(element);
        if (property && !seenKeys.has(property.key)) {
          // Add category from extractor if not set
          if (!property.category && extractor.categories.length > 0) {
            property.category = extractor.categories[0];
          }

          properties.push(property);
          seenKeys.add(property.key);
        }
      } catch (error) {
        console.error(
          `Error extracting property with extractor '${extractor.id}':`,
          error
        );
      }
    }

    return properties;
  }

  /**
   * Get renderer for a property type
   */
  getRenderer(type: PropertyType): PropertyRendererConfig | null {
    return this.renderers.get(type) || null;
  }

  /**
   * Validate a property value
   */
  validateProperty(property: EditableProperty, value: PropertyValue): boolean {
    const renderer = this.getRenderer(property.type);
    if (renderer?.validate) {
      return renderer.validate(value);
    }
    return true; // Default to valid if no validator
  }

  /**
   * Transform a property value before saving
   */
  transformProperty(
    property: EditableProperty,
    value: PropertyValue
  ): PropertyValue {
    const renderer = this.getRenderer(property.type);
    if (renderer?.transform) {
      return renderer.transform(value);
    }
    return value; // Default to no transformation
  }

  /**
   * Get all registered plugins
   */
  getPlugins(): PropertyPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugin by ID
   */
  getPlugin(pluginId: string): PropertyPlugin | null {
    return this.plugins.get(pluginId) || null;
  }

  /**
   * Get all extractors for debugging
   */
  getExtractors(): PropertyExtractorConfig[] {
    return [...this.extractors];
  }

  /**
   * Get all renderers for debugging
   */
  getRenderers(): Map<PropertyType, PropertyRendererConfig> {
    return new Map(this.renderers);
  }

  /**
   * Reset registry (useful for testing)
   */
  reset(): void {
    // Cleanup all plugins
    for (const plugin of this.plugins.values()) {
      if (plugin.cleanup) {
        try {
          plugin.cleanup();
        } catch (error) {
          console.error(`Error cleaning up plugin '${plugin.id}':`, error);
        }
      }
    }

    this.plugins.clear();
    this.extractors = [];
    this.renderers.clear();
  }
}
