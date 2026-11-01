import { createCn } from "cn/config"

// Registers the design-system type roles (see globals.css) as font sizes so
// `text-caption` does not override a text color such as `text-primary`.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "h4",
            "body-lg",
            "body",
            "body-sm",
            "label",
            "caption",
          ],
        },
      ],
    },
  },
})
