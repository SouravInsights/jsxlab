import { textPropertiesPlugin } from "./text";
import { layoutPropertiesPlugin } from "./layout";
import { colorPropertiesPlugin } from "./colors";
import { appearancePropertiesPlugin } from "./appearance";
import { borderPropertiesPlugin } from "./borders";

export {
  textPropertiesPlugin,
  layoutPropertiesPlugin,
  colorPropertiesPlugin,
  appearancePropertiesPlugin,
  borderPropertiesPlugin,
};

export const corePlugins = [
  textPropertiesPlugin,
  layoutPropertiesPlugin,
  colorPropertiesPlugin,
  appearancePropertiesPlugin,
  borderPropertiesPlugin,
];
