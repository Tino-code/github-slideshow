from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "KTU-Bot Backend is running!"

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message')

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # In a real application, you would process the user_message
        # with an NLU/NLP model and generate a response.
        # For now, we'll return a dummy response.

        bot_response = f"You said: '{user_message}'. This is a dummy response from the backend."

        return jsonify({"response": bot_response})

    except Exception as e:
        app.logger.error(f"Error in /api/chat: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001) # Using port 5001 to avoid conflict with React's default 3000
