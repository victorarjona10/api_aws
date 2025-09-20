"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsHandler = corsHandler;
function corsHandler(req, res, next) {
    try {
        res.header('Access-Control-Allow-Origin', req.header('origin') || '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            res.status(200).json({});
            return;
        }
        next();
    }
    catch (error) {
        console.error('Error in CORS handler:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
//# sourceMappingURL=corsHandler.js.map