"""Setup for graphqlcmsxblock XBlock."""

# https://github.com/ibleducation/jupyter-edx-colab-cloud-xblock

from __future__ import absolute_import

import os

from setuptools import setup


def package_data(pkg, roots):
    """Generic function to find package_data.

    All of the files under each of the `roots` will be declared as package
    data for package `pkg`.

    """
    data = []
    for root in roots:
        for dirname, _, files in os.walk(os.path.join(pkg, root)):
            for fname in files:
                data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}


setup(
    name='graphqlcmsxblock-xblock',
    version='0.1',
    description='graphqlcmsxblock XBlock',
    license='AGPL v3', 
    packages=[
        'graphqlcmsxblock',
    ],
    install_requires=[
        'XBlock',
    ],
    entry_points={
        'xblock.v1': [
            'graphqlcmsxblock = graphqlcmsxblock:GraphQlCmsXBlock',
        ]
    },
    package_data=package_data("graphqlcmsxblock", ["static", "public", "studio", "translations"]),
)
