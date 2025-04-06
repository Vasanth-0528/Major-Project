import sys
import cv2
import json
from ultralytics import YOLO

# Load YOLOv8 model
model = YOLO("best.pt")

# Get input and output video paths
input_video_path = sys.argv[1]
output_video_path = sys.argv[2]

# Open video file
cap = cv2.VideoCapture(input_video_path)
if not cap.isOpened():
    print(json.dumps({"error": "Cannot open video file"}))
    sys.exit(1)

# Get video properties
frame_width = int(cap.get(3))
frame_height = int(cap.get(4))
fps = int(cap.get(cv2.CAP_PROP_FPS))

# ✅ Set a default FPS if it is 0 or too high
if fps == 0 or fps > 60:
    fps = 30  # Default to 30 FPS

# ✅ Change codec for better browser playback
fourcc = cv2.VideoWriter_fourcc(*'avc1')  # H.264 codec for better compatibility

# Define video writer
out = cv2.VideoWriter(output_video_path, fourcc, fps, (frame_width, frame_height))

# Store detected objects (✅ UNIQUE objects only)
unique_detections = set()

# Process frames
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    

    # Perform object detection
    results = model(frame)

    # Draw bounding boxes and collect unique detections
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            label = model.names[class_id]
            
            # ✅ Store detection uniquely
            unique_detections.add((label, confidence))

            # Draw rectangle and label
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"{label} {confidence:.2f}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # Write processed frame to output video
    out.write(frame)

# Release resources
cap.release()
out.release()

# ✅ Convert set to list for JSON output
detections_list = [{"className": name, "confidence": conf} for name, conf in unique_detections]

# ✅ Print ONLY JSON output
print(json.dumps({"detections": detections_list}))
