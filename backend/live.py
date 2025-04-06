# detect.py
import sys
import cv2
from ultralytics import YOLO

# Load YOLOv8 model
model = YOLO("yolov8n.pt")

def detect_objects(frame):
    results = model(frame)
    return results.pandas().xywh[0].to_dict(orient='records')

def main():
    video_path = sys.argv[1]  # Get video path from command-line argument
    cap = cv2.VideoCapture(video_path)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Object detection on each frame
        detected_objects = detect_objects(frame)

        # Filter for specific objects: knife, gun, chainsaw, truck
        relevant_objects = []
        for obj in detected_objects:
            if obj['name'] in ['knife', 'gun', 'chainsaw', 'truck']:
                relevant_objects.append(obj)

        if relevant_objects:
            print(f"Detected objects: {relevant_objects}")
            # Send this to the Node.js backend via a socket or HTTP request
            
        # For now, let's display the frame with detected objects (for testing purposes)
        for obj in detected_objects:
            if obj['name'] in ['knife', 'gun', 'chainsaw', 'truck']:
                cv2.rectangle(frame, (int(obj['xmin']), int(obj['ymin'])),
                              (int(obj['xmax']), int(obj['ymax'])),
                              (255, 0, 0), 2)
                cv2.putText(frame, obj['name'], (int(obj['xmin']), int(obj['ymin'])-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        cv2.imshow('Object Detection', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
