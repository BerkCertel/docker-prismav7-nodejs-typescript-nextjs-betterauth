import sanitizeHtml from "sanitize-html";
import { Request, Response, NextFunction } from "express";

// String sanitize helper
const clean = (val: any) => {
  if (typeof val !== "string") return val;
  return sanitizeHtml(val, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

// Object sanitizer (Recursive)
const deepSanitize = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepSanitize(item));
  }

  if (obj !== null && typeof obj === "object") {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      cleaned[key] = deepSanitize(obj[key]);
    }
    return cleaned;
  }

  return clean(obj);
};

export const sanitizerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Body sanitize
    if (req.body && typeof req.body === "object") {
      req.body = deepSanitize(req.body);
    }

    // Query sanitize (mutate — readOnly kırılmaz)
    if (req.query) {
      for (const key of Object.keys(req.query)) {
        const val = req.query[key];
        req.query[key] = Array.isArray(val)
          ? val.map((v) => clean(v))
          : clean(val);
      }
    }

    // Params sanitize
    if (req.params) {
      for (const key of Object.keys(req.params)) {
        req.params[key] = clean(req.params[key]);
      }
    }

    next();
  } catch (err) {
    console.error("Sanitize error:", err);
    next();
  }
};
