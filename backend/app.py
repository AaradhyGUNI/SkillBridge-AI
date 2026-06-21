import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from routes.api import api_bp

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure CORS - Allow all origins for development. In production, restrict this.
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register routes blueprint under the '/api' prefix
app.register_blueprint(api_bp, url_prefix='/api')

# Custom error handlers for common HTTP status codes
@app.errorhandler(404)
def resource_not_found(e):
    return jsonify({"error": "The requested resource could not be found."}), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "The method is not allowed for the requested URL."}), 405

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify({"error": "An internal server error occurred. Please try again later."}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', '1') == '1'
    print(f"Starting SkillBridge AI Flask backend on port {port} (debug={debug})...")
    app.run(host='0.0.0.0', port=port, debug=debug)
