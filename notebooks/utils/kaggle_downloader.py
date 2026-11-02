# Helper script to download dataset from Kaggle via Python

import os
import subprocess

def download_kaggle_dataset(dataset_slug: str, target_dir: str):
    """
    Downloads and extracts a Kaggle dataset into target_dir.
    Requires kaggle API credentials in ~/.kaggle/kaggle.json
    """
    os.makedirs(target_dir, exist_ok=True)
    command = f"kaggle datasets download -d {dataset_slug} -p \"{target_dir}\" --unzip"
    print(f"Executing: {command}")
    subprocess.run(command, shell=True, check=True)
    print(f"Dataset extracted to {target_dir}")

if __name__ == "__main__":
    slug = "andrewmvd/hard-hat-detection"
    download_kaggle_dataset(slug, "../../data/raw")
