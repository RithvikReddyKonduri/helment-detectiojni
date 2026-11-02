# Helper script to convert Pascal VOC XML labels to YOLO format

import os
import xml.etree.ElementTree as ET

# Class index lookup
CLASSES = {
    "helmet": 0,
    "head": 1,
    "person": 2
}

def convert_box(size, box):
    # Normalize coordinates to 0.0 - 1.0 range
    dw = 1.0 / size[0]
    dh = 1.0 / size[1]
    x = (box[0] + box[1]) / 2.0 - 1
    y = (box[2] + box[3]) / 2.0 - 1
    w = box[1] - box[0]
    h = box[3] - box[2]
    return (x * dw, y * dh, w * dw, h * dh)

def convert_annotation(xml_file, output_txt_file):
    # Reads one XML file and writes a YOLO format .txt label file
    tree = ET.parse(xml_file)
    root = tree.getroot()
    size = root.find('size')
    w = int(size.find('width').text)
    h = int(size.find('height').text)

    with open(output_txt_file, 'w') as out_file:
        for obj in root.iter('object'):
            cls_name = obj.find('name').text.lower()
            if cls_name not in CLASSES:
                continue
            cls_id = CLASSES[cls_name]
            xmlbox = obj.find('bndbox')
            b = (float(xmlbox.find('xmin').text), float(xmlbox.find('xmax').text),
                 float(xmlbox.find('ymin').text), float(xmlbox.find('ymax').text))
            bb = convert_box((w, h), b)
            out_file.write(f"{cls_id} {' '.join([str(round(a, 6)) for a in bb])}\n")

if __name__ == "__main__":
    print("[Helper] Label converter ready to process dataset annotations.")
