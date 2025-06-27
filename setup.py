# setup.py
from setuptools import setup, find_packages

setup(
    name="harvestguard",
    packages=find_packages(where="backend"),
    package_dir={"": "backend"},
)