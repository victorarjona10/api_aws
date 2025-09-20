"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingHandler = loggingHandler;
function loggingHandler(req, res, next) {
    console.log(`Incoming -Method: [${req.method}] -URL [${req.url}] - IP [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        var _a;
        const status = (_a = res.statusCode) !== null && _a !== void 0 ? _a : 'unknown';
        console.log(`Incoming -Method: [${req.method}] -URL [${req.url}] - IP [${req.socket.remoteAddress}] -STATUS [${status}]`);
    });
    next();
}
//# sourceMappingURL=loggingHandler.js.map