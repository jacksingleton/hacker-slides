@0x87742b8004358e72;

using Spk = import "/sandstorm/package.capnp";
# This imports:
#   $SANDSTORM_HOME/latest/usr/include/sandstorm/package.capnp
# Check out that file to see the full, documented package definition format.

const pkgdef :Spk.PackageDefinition = (
  # The package definition. Note that the spk tool looks specifically for the
  # "pkgdef" constant.

  id = "7qvcjh7gk0rzdx1s3c8gufd288sesf6vvdt297756xcv4q8xxvhh",
  # Your app ID is actually its public key. The private key was placed in
  # your keyring. All updates must be signed with the same key.


  manifest = (
    appTitle = (defaultText = "Hacker Slides"),
    # This manifest is included in your app package to tell Sandstorm
    # about your app.

    appVersion = 5,  # Increment this for every release.
    appMarketingVersion = (defaultText = "0.4.0"),

    actions = [
      # Define your "new document" handlers here.
      ( title = (defaultText = "New Slides"),
        nounPhrase = (defaultText = "slides"),
        command = .myCommand
        # The command to run when starting for the first time. (".myCommand"
        # is just a constant defined at the bottom of the file.)
      )
    ],

    continueCommand = .myCommand,
    # This is the command called to start your app back up after it has been
    # shut down for inactivity. Here we're using the same command as for
    # starting a new instance, but you could use different commands for each
    # case.

    metadata = (
      icons = (
        appGrid = (svg = embed "app-graphics/hackerslides-128.svg"),
        grain = (svg = embed "app-graphics/hackerslides-24.svg"),
        market = (svg = embed "app-graphics/hackerslides-150.svg"),
      ),

      website = "https://github.com/jacksingleton/hacker-slides",
      codeUrl = "https://github.com/jacksingleton/hacker-slides",
      license = (openSource = mit),
      categories = [office, productivity],

      author = (
        contactEmail = "hackerslides@jacksingleton.com",
        pgpSignature = embed "pgp-signature",
      ),

      pgpKeyring = embed "pgp-keyring",

      description = (defaultText = embed "description.md"),
      shortDescription = (defaultText = "Presentation tool"),

      screenshots = [
        (width = 448, height = 343, png = embed "screenshot.png")
      ],
    ),
  ),

  sourceMap = (
    # Here we defined where to look for files to copy into your package. The
    # `spk dev` command actually figures out what files your app needs
    # automatically by running it on a FUSE filesystem. So, the mappings
    # here are only to tell it where to find files that the app wants.
    searchPath = [
      ( sourcePath = ".", hidePaths = [".git", ".vagrant"] ),  # Search this directory first.
      ( sourcePath = "/",    # Then search the system root directory.
        hidePaths = [ "home", "proc", "sys", "vagrant", "*.pyc",
                      "etc/passwd", "etc/hosts", "etc/host.conf",
                      "etc/nsswitch.conf", "etc/resolv.conf",
                      # For all vagrant-spk apps, we don't care about the Vagrant
                      # VM state, so we ignore it here.
                      "opt/app/.sandstorm/.vagrant"]
        # You probably don't want the app pulling files from these places,
        # so we hide them. Note that /dev, /var, and /tmp are implicitly
        # hidden because Sandstorm itself provides them.
      )
    ]
  ),

  fileList = "sandstorm-files.list",
  # `spk dev` will write a list of all the files your app uses to this file.
  # You should review it later, before shipping your app.

  alwaysInclude = [
    "usr/lib/python3.4", # include all of the Python runtime
    "usr/lib/python3", # include pure-Python packages from Debian
    "usr/local/lib/python3.4", # include python packages from pip
    "opt/app/static",
  ],
  # Fill this list with more names of files or directories that should be
  # included in your package, even if not listed in sandstorm-files.list.
  # Use this to force-include stuff that you know you need but which may
  # not have been detected as a dependency during `spk dev`. If you list
  # a directory here, its entire contents will be included recursively.
);

const myCommand :Spk.Manifest.Command = (
  # Here we define the command used to start up your server.
  argv = ["/sandstorm-http-bridge", "8000", "--", "/opt/app/.sandstorm/launcher.sh"],
  environ = [
    # Note that this defines the *entire* environment seen by your app.
    (key = "PATH", value = "/usr/local/bin:/usr/bin:/bin"),
    (key = "HOME", value = "/var")
  ]
);
