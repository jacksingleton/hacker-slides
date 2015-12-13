import capnp
import socket
import shutil
import os


# Hack to make RPC work within flask worker threads.  May change in the future.
# Since it relies on thread-local storage, this means we can't share
# capabilities or eventloops across threads.
capnp.remove_event_loop()
capnp.create_event_loop(threaded=True)

# Load the relevant interface descriptors from the current sandstorm bundle.
bridge = capnp.load("/opt/sandstorm/latest/usr/include/sandstorm/sandstorm-http-bridge.capnp",
            imports=[
                "/opt/sandstorm/latest/usr/include",
            ]
        )
hack_session = capnp.load("/opt/sandstorm/latest/usr/include/sandstorm/hack-session.capnp",
            imports=[
                "/opt/sandstorm/latest/usr/include",
            ]
        )

CODE_DIR = os.path.dirname(os.path.realpath(__file__))

SLIDES_PATH = '/index.html'


def update_static_publish_folder():
    """
    Build the new static publishing root in a new folder, then move it to the magic /var/www.

    This approach allows for clean upgrades if any static assets are added or removed over time.
    This function can use fixed paths because it is called only from the main application thread.
    """
    if os.path.isdir("/var/new-www"):
        shutil.rmtree("/var/new-www")
    os.mkdir("/var/new-www")
    shutil.copytree(os.path.join(CODE_DIR, "static"), "/var/new-www/static")
    shutil.copy2("/var/new-www/static/slides.html", "/var/new-www" + SLIDES_PATH)
    if os.path.exists("/var/www"):
        os.rename("/var/www", "/var/old-www")
    os.rename("/var/new-www", "/var/www")
    if os.path.exists("/var/old-www"):
        shutil.rmtree("/var/old-www")

def update_published_slides():
    shutil.copy2("/var/slides.md", "/var/www/slides.md")

def get_bridge_cap():
    # Connect to the socket exposed by sandstorm-http-bridge
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    sock.connect("/tmp/sandstorm-api")
    client = capnp.TwoPartyClient(sock)
    bridge_cap = client.bootstrap().cast_as(bridge.SandstormHttpBridge)
    return bridge_cap

def publish(session_id):
    bridge_cap = get_bridge_cap()
    session_ctx = bridge_cap.getSessionContext(session_id).wait().context.cast_as(hack_session.HackSessionContext)
    public_id = session_ctx.getPublicId().wait()
    publishing_root = public_id.autoUrl
    return publishing_root + SLIDES_PATH
