import sys
import cv2
import json
from ultralytics import YOLO

# Ensure correct number of arguments
if len(sys.argv) < 3:
    print(json.dumps({"error": "Missing input/output path arguments"}))
    sys.exit(1)

input_path = sys.argv[1]
output_path = sys.argv[2]


model = YOLO("yolov8n.pt")



image = cv2.imread(input_path)
if image is None:
    print(json.dumps({"error": f"Failed to load image: {input_path}"}))
    sys.exit(1)

results = model(image)  

detected_objects = []


for result in results:
    for box in result.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates
        conf = float(box.conf[0])  # Confidence score
        cls = int(box.cls[0])  # Class ID
        label = model.names[cls]  # ✅ Get actual class name

        # Store detected object with class name
        detected_objects.append({"class": cls, "className": label, "confidence": conf})

        # Draw box with label
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(image, f"{label} ({conf:.2f})", 
                    (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 
                    (0, 255, 0), 2)

# Save processed image
cv2.imwrite(output_path, image)

# Print only JSON (No extra logs)
print(json.dumps({"detections": detected_objects, "output_path": output_path}))
