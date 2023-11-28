import type { NodePlopAPI } from "node-plop";
import { getInitWidgetActions } from "./actions.js";
import { prompts } from "./prompts.js";

const generateWidgetGeneratorName = "widget-generate";

const getInitWidgetGenerator = (basePath: string, plop: NodePlopAPI) => {
  const actions = getInitWidgetActions(basePath, plop);

  plop.setGenerator(generateWidgetGeneratorName, {
    prompts,
    actions,
  });

  return plop.getGenerator(generateWidgetGeneratorName);
};

export { getInitWidgetGenerator };
