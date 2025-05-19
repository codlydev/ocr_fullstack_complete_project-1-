import pytesseract
from PIL import Image
import cv2
import numpy as np

def extract_text(image_path: str) -> str:
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    temp_path = "processed.png"
    cv2.imwrite(temp_path, thresh)
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(Image.open(temp_path), config=custom_config)
    return text.strip()