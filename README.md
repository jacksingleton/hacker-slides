# Sandstorm Hacker Slides

![Screenshot](https://cloud.githubusercontent.com/assets/1058938/6180867/9acdea84-b2df-11e4-8ae8-b01f2c4d7e1d.png)

A simple app that combines [Ace Editor](https://github.com/ajaxorg/ace/) and [RevealJS](https://github.com/hakimel/reveal.js)

You can write markdown on the left, and preview your presentation on the right.

[![Try it on Sandstorm](https://img.shields.io/badge/try-live%20demo-783189.svg)](https://demo.sandstorm.io/appdemo/7qvcjh7gk0rzdx1s3c8gufd288sesf6vvdt297756xcv4q8xxvhh)

## Hack on Hacker Slides

I built this app very quickly and it is unfortunately not one of my main
priorities right now. Contributions are very welcome!

Hacker Slides uses [vagrant-spk](https://github.com/sandstorm-io/vagrant-spk), so dev setup is quite easy.

1. You will need vagrant-spk installed. If you get an error running the
following command, follow the [vagrant-spk installation
instructions](https://docs.sandstorm.io/en/latest/vagrant-spk/installation/)

  ```bash
  $ vagrant-spk -h
  usage: /home/jack/bin/vagrant-spk [-h] [--work-directory WORK_DIRECTORY]
  ...
  ```

2. Make sure you have [virtualbox](https://www.virtualbox.org/wiki/Downloads) installed before bringing up vagrant vm

  ```bash
  $ VirtualBox -h
  Oracle VM VirtualBox Manager 5.0.0
  ...
  ```

3. Bring up the Vagrant VM

  ```bash
  $ vagrant-spk vm up
  ```

4. Start the application in dev mode

  ```bash
  $ vagrant-spk dev
  ```

5. Navigate to the Sandstorm dev instance

  `http://local.sandstorm.io:6080/`

Here are some things to know about the code base.

* It's a little hacky (it is _Hacker_ Slides after all :))
* [RevealJS 3.0.0](https://github.com/hakimel/reveal.js/tree/3.0.0) has been
  copied into the `static/revealjs` directory.
* `main.py` is a super simple python server that mainly just accepts GETs and
  PUTs for `/slides.md` and reads and saves markdown from/to `/var/slides.md`
* `index.{html,js}` is the one and only main page for the app. Its only job is to
  load Ace Editor on the left side of the screen, and `slides.html` in an
  iframe on the right side.
* `slides.{html,js}` sets up RevealJS to load markdown from `/slides.md`. It
  also knows how to reload the markdown via a postMessage call.
* `save.js` adds a debounced `keyup` handler to the editor that a) fires off an
  ajax PUT to save the markdown content and b) sends a postMessage message to
  the RevealJS iframe telling it to reload its markdown preview (which
  currently roundtrips to the server again)
