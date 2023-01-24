from flask import Flask, request, jsonify
import cv2
import numpy as np
from flask import make_response

app = Flask(__name__)


@app.route('/detect_pink', methods=['POST'])
def detect_pink():
    # Get the image file from the request
    image_file = request.files['image']


        # Read the image file
    img = cv2.imdecode(np.fromstring(image_file.read(), np.uint8), cv2.IMREAD_COLOR)

        # Convert to hsv
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # Define the range of pink color in hsv
    lower_pink = (150,100,100)
    upper_pink = (180,255,255)

    # Threshold the image to create a binary image
    mask = cv2.inRange(hsv, lower_pink, upper_pink)

    # Find contours in the binary image
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Find the contour with the largest area
    c = max(contours, key=cv2.contourArea)

    # Find the center of the contour
    M = cv2.moments(c)
    cX = int(M["m10"] / M["m00"])
    cY = int(M["m01"] / M["m00"])

    # Draw the square box on the original image
    cv2.rectangle(img,(cX-25,cY-25),(cX+25,cY+25),(0,255,255),3)

    # Encode the processed image in JPEG format
    _, img_encoded = cv2.imencode('.jpg', img)

        # Return the processed image
    # cv2.imshow("Image", img)
    cv2.waitKey(0)
    response = make_response(img_encoded.tobytes())
    response.headers.set('Content-Type', 'image/jpeg')
    response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
    return response

    #return jsonify(img=img_encoded.tostring())


if __name__ == '__main__':
    app.run(debug=True)
