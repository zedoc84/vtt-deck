#!/usr/bin/env python3
"""
Fabrique les profils Stream Deck prêts à l'emploi fournis avec le plugin :
  com.vttdeck.foundry.sdPlugin/profiles/vtt-deck-<exploration|combat>-<15|xl|plus|plusxl|neo|mini>.streamDeckProfile

Format « Version 2.0 » des profils exportés par l'application Stream Deck (archive zip) :
  <UUID>.sdProfile/manifest.json                    nom, modèle d'appareil, pages
  <UUID>.sdProfile/Profiles/<page>/manifest.json    touches de la page (« colonne,ligne »)
Le nom de dossier d'une page est son UUID encodé (128 bits + 2 bits à zéro, base 32
« 0-9 A-T V W », suivi de « Z »). Un dossier Stream Deck est une page de plus,
ouverte par l'action « openchild » ; sa touche 0,0 est « backtoparent ».

Les UUID sont dérivés des noms (uuid5) : relancer le script donne exactement les mêmes fichiers.
Usage : python3 tools/make-profiles.py
"""
import io, json, os, uuid, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
PLUGIN = os.path.normpath(os.path.join(HERE, "..", "com.vttdeck.foundry.sdPlugin"))
OUT = os.path.join(PLUGIN, "profiles")
NS = uuid.UUID("5b8f7a52-3c1e-4c55-9a0e-7d1c2f9b6e01")
ALPHA = "0123456789ABCDEFGHIJKLMNOPQRSTVW"

ACTION_NAMES = {
    "macro": "Macro", "scene": "Scene", "token": "Token", "combat": "Combat", "playlist": "Music & Sounds",
    "system": "System", "numpad": "Damage & Healing Pad", "ambiance": "Ambience", "page": "Dynamic Page",
    "sequence": "Sequence", "dial": "Dial",
}

# type d'appareil (manifest « DeviceType ») → modèle, colonnes, lignes, suffixe de fichier
DEVICES = {
    0: ("20GAA9902", 5, 3, "15"),
    2: ("20GAT9901", 8, 4, "xl"),
    7: ("20GBD9901", 4, 2, "plus"),  # référence 10GBD9901 (à confirmer sur un vrai Stream Deck +)
    9: ("20GBJ9901", 4, 2, "neo"),
    1: ("20GAI9901", 3, 2, "mini"),
    # Stream Deck + XL : 36 touches (9 × 4), 6 molettes. Modèle déduit de la référence 10GBX9901 :
    # à confirmer en exportant un profil depuis un vrai Stream Deck + XL.
    13: ("20GBX9901", 9, 4, "plusxl"),
}
# appareils avec molettes et écran tactile
ENCODER_DEVICES = {7, 13}


def uid(*parts):
    return uuid.uuid5(NS, "/".join(map(str, parts)))


def page_dir(u):
    n = int.from_bytes(u.bytes, "big") << 2
    return "".join(ALPHA[(n >> (5 * (25 - i))) & 31] for i in range(26)) + "Z"


def state(**extra):
    s = {"FontFamily": "", "FontSize": 9, "FontStyle": "", "FontUnderline": False, "OutlineThickness": 2,
         "ShowTitle": True, "TitleAlignment": "bottom", "TitleColor": "#ffffff"}
    s.update(extra)
    return s


# --- raccourcis de touches -------------------------------------------------
def A(action, **settings):
    return ("plugin", action, settings)

def scene_item(): return A("page", kind="scenes", role="item", sceneMode="view")
def scene_next(): return A("page", kind="scenes", role="next")
def macro_item(): return A("page", kind="macros", role="item")
def macro_next(): return A("page", kind="macros", role="next")
def pl_item(): return A("page", kind="playlists", role="item")
def pl_next(): return A("page", kind="playlists", role="next")
def auto(): return A("combat", fn="auto", order="active", display="name")
def cfn(fn): return A("combat", fn=fn)
def num(k, **kw): return A("numpad", key=str(k), **kw)
def inc(step): return A("numpad", key="inc", step=step)
def token(display="name"): return A("token", target="selected", display=display)
def party(): return A("token", target="party", display="bar1")
def pause(): return A("system", fn="pause")
def stop_all(): return A("playlist", mode="stopAll")
def ambiance(): return A("ambiance")
def folder(rows): return ("folder", rows)
def dial(fn, **kw): return A("dial", fn=fn, **kw)
def pool(): return A("system", fn="rollPool")
def clear_targets(): return A("system", fn="clearTargets")

# molettes du Stream Deck + (de gauche à droite)
DIALS = {
    ("plus", "exploration"): [dial("musicVolume"), dial("ambientVolume"), dial("darkness"), dial("zoom")],
    ("plus", "combat"): [dial("tokenHp"), dial("initiative"), dial("targets"), dial("darkness")],
    ("plusxl", "exploration"): [dial("musicVolume"), dial("darkness"), dial("party"), dial("scenes"), dial("tracks"), dial("macros")],
    ("plusxl", "combat"): [dial("targets"), dial("initiative"), dial("tokenHp"), dial("party"), dial("dice"), dial("zoom")],
}


# --- dispositions (une liste de lignes, une ligne = liste de touches ou None) ---
NUMPAD_15 = [
    [None, num(7), num(8), num(9), num("display")],
    [num("clear"), num(4), num(5), num(6), num("damage")],
    [num(0), num(1), num(2), num(3), num("heal")],
]
NUMPAD_8 = [
    [None, inc(1), inc(5), inc(10)],
    [num("display"), num("clear"), num("damage"), num("heal")],
]
NUMPAD_6 = [
    [None, inc(1), inc(5)],
    [num("display"), num("damage"), num("heal")],
]

LAYOUTS = {
    ("15", "exploration"): [
        [scene_item()] * 4 + [scene_next()],
        [macro_item()] * 4 + [macro_next()],
        [token(), pl_item(), pl_item(), pl_next(), pause()],
    ],
    ("15", "combat"): [
        [auto()] * 5,
        [cfn("prev"), cfn("round"), cfn("next"), cfn("rollNPC"), folder(NUMPAD_15)],
        [token("bar1"), cfn("start"), cfn("end"), cfn("toggleCombat"), pause()],
    ],
    ("xl", "exploration"): [
        [scene_item()] * 7 + [scene_next()],
        [macro_item()] * 7 + [macro_next()],
        [party()] * 4 + [pl_item()] * 3 + [pl_next()],
        [token(), ambiance(), ambiance(), ambiance(), ambiance(), stop_all(), cfn("start"), pause()],
    ],
    ("xl", "combat"): [
        [auto()] * 8,
        [cfn("prev"), cfn("round"), cfn("next"), cfn("rollNPC"), cfn("rollAll"), cfn("toggleCombat"), cfn("end"), pause()],
        [num(1), num(2), num(3), num(4), num(5), num("display"), num("damage"), num("heal")],
        [num(6), num(7), num(8), num(9), num(0), num("clear"), num("back"), token("bar1")],
    ],
    ("plusxl", "exploration"): [
        [scene_item()] * 8 + [scene_next()],
        [macro_item()] * 8 + [macro_next()],
        [party()] * 4 + [pl_item()] * 4 + [pl_next()],
        [token(), ambiance(), ambiance(), ambiance(), ambiance(), stop_all(), cfn("start"), clear_targets(), pause()],
    ],
    ("plusxl", "combat"): [
        [auto()] * 9,
        [cfn("prev"), cfn("round"), cfn("next"), cfn("rollNPC"), cfn("rollAll"), cfn("toggleCombat"), cfn("end"), clear_targets(), pause()],
        [num(1), num(2), num(3), num(4), num(5), num("display"), num("damage"), num("heal"), pool()],
        [num(6), num(7), num(8), num(9), num(0), num("clear"), num("back"), token("bar1"), party()],
    ],
    ("plus", "exploration"): [
        [scene_item()] * 3 + [scene_next()],
        [macro_item()] * 3 + [macro_next()],
    ],
    ("plus", "combat"): [
        [auto()] * 4,
        [cfn("next"), cfn("round"), token("bar1"), folder(NUMPAD_8)],
    ],
    ("mini", "exploration"): [
        [scene_item()] * 2 + [scene_next()],
        [macro_item()] * 2 + [macro_next()],
    ],
    ("mini", "combat"): [
        [auto()] * 3,
        [cfn("next"), cfn("round"), folder(NUMPAD_6)],
    ],
}
LAYOUTS[("neo", "exploration")] = LAYOUTS[("plus", "exploration")]
LAYOUTS[("neo", "combat")] = LAYOUTS[("plus", "combat")]

FOLDER_ICON = os.path.join(PLUGIN, "imgs", "keys", "numpad@2x.png")


def plugin_action(key_prefix, pos, k):
    _, action, settings = k
    return {"ActionID": str(uid(key_prefix, pos)), "LinkedTitle": True, "Name": ACTION_NAMES[action],
            "Settings": dict(settings), "State": 0, "States": [state()],
            "UUID": f"com.vttdeck.foundry.{action}"}


def build_page(key_prefix, rows, pages, device_type, is_folder=False, dials=None):
    """Retourne l'UUID de la page ; ajoute la page (et ses sous-dossiers) dans « pages »."""
    page_uuid = uid(key_prefix, "page")
    actions = {}
    images = {}
    if is_folder:
        actions["0,0"] = {"ActionID": str(uid(key_prefix, "back")), "LinkedTitle": False, "Name": "Open Folder",
                          "Settings": None, "State": 0, "States": [state()],
                          "UUID": "com.elgato.streamdeck.profile.backtoparent"}
    for r, row in enumerate(rows):
        for c, k in enumerate(row):
            if k is None:
                continue
            pos = f"{c},{r}"
            aid = str(uid(key_prefix, pos))
            if k[0] == "folder":
                child = build_page(f"{key_prefix}/{pos}", k[1], pages, device_type, is_folder=True)
                img_name = page_dir(uid(key_prefix, pos, "img")) + ".png"
                images[img_name] = open(FOLDER_ICON, "rb").read()
                actions[pos] = {"ActionID": aid, "LinkedTitle": True, "Name": "Create Folder",
                                "Settings": {"ProfileUUID": str(child)}, "State": 0,
                                "States": [state(Image=f"Images/{img_name}", Title="", TitleAlignment="middle")],
                                "UUID": "com.elgato.streamdeck.profile.openchild"}
            else:
                actions[pos] = plugin_action(key_prefix, pos, k)
    controllers = [{"Actions": actions, "Type": "Keypad"}]
    if device_type in ENCODER_DEVICES:  # Stream Deck + et + XL : molettes
        enc = {f"{c},0": plugin_action(f"{key_prefix}/enc", f"{c},0", k) for c, k in enumerate(dials or [])}
        controllers.append({"Actions": enc, "Type": "Encoder"})
    pages[page_uuid] = ({"Controllers": controllers, "Icon": "", "Name": ""}, images)
    return page_uuid


def write_profile(device_type, kind):
    model, cols, rows_n, suffix = DEVICES[device_type]
    rows = LAYOUTS[(suffix, kind)]
    assert len(rows) <= rows_n and all(len(r) <= cols for r in rows), (suffix, kind)
    prefix = f"vtt-deck/{suffix}/{kind}"
    pages = {}
    main = build_page(prefix, rows, pages, device_type, dials=DIALS.get((suffix, kind)))
    default = uid(prefix, "default")
    pages[default] = ({"Controllers": [{"Actions": {}, "Type": "Keypad"}] + ([{"Actions": {}, "Type": "Encoder"}] if device_type in ENCODER_DEVICES else []),
                       "Icon": "", "Name": ""}, {})
    root = str(uid(prefix, "profile")).upper() + ".sdProfile"
    manifest = {"Device": {"Model": model, "UUID": ""},
                "Name": f"VTT Deck – {'Combat' if kind == 'combat' else 'Exploration'}",
                "Pages": {"Current": str(main), "Default": str(default), "Pages": [str(main)]},
                "Version": "2.0"}

    buf = io.BytesIO()
    fixed = (2026, 1, 1, 0, 0, 0)

    def add_dir(z, name):
        z.writestr(zipfile.ZipInfo(name, fixed), b"")

    def add_file(z, name, data, compress=True):
        info = zipfile.ZipInfo(name, fixed)
        info.compress_type = zipfile.ZIP_DEFLATED if compress else zipfile.ZIP_STORED
        z.writestr(info, data)

    with zipfile.ZipFile(buf, "w") as z:
        add_dir(z, f"{root}/")
        add_dir(z, f"{root}/Images/")
        add_file(z, f"{root}/manifest.json", json.dumps(manifest, ensure_ascii=False, separators=(",", ":")))
        add_dir(z, f"{root}/Profiles/")
        for pu in sorted(pages, key=page_dir):
            content, images = pages[pu]
            d = f"{root}/Profiles/{page_dir(pu)}"
            add_dir(z, f"{d}/")
            add_dir(z, f"{d}/Images/")
            for name, data in sorted(images.items()):
                add_file(z, f"{d}/Images/{name}", data, compress=False)
            add_file(z, f"{d}/manifest.json", json.dumps(content, ensure_ascii=False, separators=(",", ":")))
    path = os.path.join(OUT, f"vtt-deck-{kind}-{suffix}.streamDeckProfile")
    with open(path, "wb") as f:
        f.write(buf.getvalue())
    return path


def main():
    os.makedirs(OUT, exist_ok=True)
    for device_type in DEVICES:
        for kind in ("exploration", "combat"):
            print("✔", os.path.relpath(write_profile(device_type, kind), PLUGIN))


if __name__ == "__main__":
    main()
