import os
import sys
from setuptools import setup, find_packages
from tethys_apps.app_installation import custom_develop_command, custom_install_command

### Apps Definition ###
app_package = 'dewater'
release_package = 'tethysapp-' + app_package
app_class = 'dewater.app:DewaterTool'
app_package_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tethysapp', app_package)

### Python Dependencies ###
dependencies = []

setup(
    name=release_package,
    version='0',
    description='app to simulate dewatering an area where the user defines the bedrock elevation and groundwater table elevation (constants) and can add wells to draw the water out of the aquifer.',
    long_description='',
    keywords='',
    author='Jacob Fullerton',
    author_email='jacobbfull@gmail.com',
    url='',
    license='BSD 2-Clause License',
    packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
    namespace_packages=['tethysapp', 'tethysapp.' + app_package],
    include_package_data=True,
    zip_safe=False,
    install_requires=dependencies,
    cmdclass={
        'install': custom_install_command(app_package, app_package_dir, dependencies),
        'develop': custom_develop_command(app_package, app_package_dir, dependencies)
    }
)
