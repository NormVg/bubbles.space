import { defineDynamic, defineInstructions } from "eve/instructions";

export default defineDynamic({
  events: {
    "turn.started": (_event, _ctx) => {
      const now = new Date();
      return defineInstructions({
        markdown: `Current Date and Time Context: ${now.toLocaleString()}`,
      });
    },
  },
});
