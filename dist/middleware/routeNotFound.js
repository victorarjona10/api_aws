"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = routeNotFound;
function routeNotFound(req, res, next) {
    const error = new Error(`Route Not Found: ${req.url}`);
    console.log(error.message);
    res.status(404).json({ error: error.message });
}
//# sourceMappingURL=routeNotFound.js.map