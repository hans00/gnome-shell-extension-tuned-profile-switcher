[//]: # (gnome-shell-extension-tuned-profile-switcher)
[//]: # (README.md)


# A gnome-shell-extension-tuned-profile-switcher documentation

*gnome-shell-extension-tuned-profile-switcher is a [GNOME Shell](https://wiki.gnome.org/Projects/GnomeShell) [TuneD](https://tuned-project.org/) profile switcher extension*

Contents
* [Features](#features)
* [Requirements](#requirements)
* [Installation](#installation)
* [Licensing](#licensing)
* [Contacts](#contacts)

## Features
* TuneD toggle in the Quick Settings menu, next to the system Power Mode toggle.
* Toggle switches TuneD automatic profile selection on and off.
* Toggle menu lists all TuneD profiles with human-readable names and switches between them.
* Common performance levels (power saver, balanced, performance) are marked with the system power profile icons.

## Requirements
* GNOME Shell 45 - 51 (e.g. Ubuntu 24.04 LTS - 26.10).
* [TuneD](https://tuned-project.org/) installed and running.

## Installation
From source:

```console
$ make build
$ gnome-extensions install --force tmp/tuned-profile-switcher@hans00.me.zip
```

Then log out and log back in, and enable the extension:

```console
$ gnome-extensions enable tuned-profile-switcher@hans00.me
```

## Licensing
gnome-shell-extension-tuned-profile-switcher is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
For complete license text see COPYING file.

## Contacts
**Project Website**: https://github.com/hans00/gnome-shell-extension-tuned-profile-switcher/

**Maintainer**: Hans <me@hans00.me>

Forked from [vint21h/gnome-shell-extension-tuned-profile-switcher](https://github.com/vint21h/gnome-shell-extension-tuned-profile-switcher/) by Alexei Andrushievich <vint21h@vint21h.pp.ua>.

For complete authors list see AUTHORS file.
