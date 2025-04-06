import cv2
import time
import os
import base64
from flask import Flask, Response, jsonify,send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

model = YOLO("yolov8n.pt")

ALERT_CLASSES = {"knife", "gun", "truck", "chainsaw"}

output_folder = "livevideo"
os.makedirs(output_folder, exist_ok=True)

cap = None
out = None
recording = False

def generate_frames():
    global cap, out, recording

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = 30  # Manually setting FPS to 30 to ensure steady recording

    fourcc = cv2.VideoWriter_fourcc(*'avc1') 
    output_file = os.path.join(output_folder, f"recorded_{int(time.time())}.mp4")
    out = cv2.VideoWriter(output_file, fourcc, fps, (frame_width, frame_height))

    recording = True
    start_time = time.time()
    record_duration = 60  

    frame_interval = 1 / fps  # Time interval between frames
    last_frame_time = time.time()

    while recording:
        current_time = time.time()

        # Capture frames only if enough time has passed
        if current_time - last_frame_time >= frame_interval:
            ret, frame = cap.read()
            if not ret:
                break

            results = model(frame)

            detected_objects = set()
            for r in results:
                for box in r.boxes:
                    cls = int(box.cls[0])  
                    label = model.names[cls]  
                    if label in ALERT_CLASSES:
                        detected_objects.add(label)

            # If an alert object is detected, send a Socket.io event
            if detected_objects:
                socketio.emit("object-detection-alert", {"objects": list(detected_objects)})

            frame = results[0].plot()

            out.write(frame)  # Save the frame to the video file

            _, buffer = cv2.imencode(".jpg", frame)
            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

            last_frame_time = current_time  # Update the last frame timestamp

        if current_time - start_time > record_duration:
            break

    cap.release()
    out.release()
    recording = False


@app.route("/video_feed")
def video_feed():
    return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

# Flask route to start monitoring
@app.route("/start-live-monitoring", methods=["POST"])
def start_monitoring():
    global recording
    if not recording:
        return jsonify({"message": "Live monitoring started", "videoUrl": "/video_feed"})
    else:
        return jsonify({"message": "Already running"}), 400

# Flask route to stop monitoring
@app.route("/stop-live-monitoring", methods=["POST"])
def stop_monitoring():
    global recording
    if recording:
        recording = False
        return jsonify({"message": "Live monitoring stopped"})
    else:
        return jsonify({"message": "No active session"}), 400
    
@app.route("/videos/<filename>")
def get_video(filename):
    return send_from_directory("livevideo", filename)

@app.route("/get-recorded-videos", methods=["GET"])
def get_recorded_videos():
    try:
        videos = [f for f in os.listdir(output_folder) if f.endswith(".mp4")]
        return jsonify({"videos": videos})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run Flask app
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=4000, debug=True)
