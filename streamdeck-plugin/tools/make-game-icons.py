#!/usr/bin/env python3
"""Bibliothèque d'icônes game-icons.net pour l'inspecteur du plugin.

Usage : python3 -I tools/make-game-icons.py <icons.json d'@iconify-json/game-icons> <dossier icons/ du dépôt game-icons/icons>

Écrit :
  com.vttdeck.foundry.sdPlugin/ui/game-icons.js   tracés SVG (512 × 512) de toutes les icônes, avec leur auteur
  com.vttdeck.foundry.sdPlugin/GAME-ICONS-CREDITS.txt  attribution (licence CC BY 3.0)

Les icônes sont dessinées par des humains (Lorc, Delapouite et d'autres auteurs) et publiées sous licence
CC BY 3.0 (quelques-unes en CC0) : https://game-icons.net — https://github.com/game-icons/icons
"""
import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "com.vttdeck.foundry.sdPlugin")
PATH_RE = re.compile(r'^<path fill="currentColor" d="([MmLlHhVvCcSsQqTtAaZz0-9eE.,\s+-]+)"/>$')

# Noms d'affichage des auteurs (dossiers du dépôt game-icons/icons, d'après son license.txt)
AUTHOR_NAMES = {
    "lorc": "Lorc", "delapouite": "Delapouite", "john-colburn": "John Colburn", "felbrigg": "Felbrigg",
    "john-redman": "John Redman", "carl-olsen": "Carl Olsen", "sbed": "Sbed", "priorblue": "PriorBlue",
    "willdabeast": "Willdabeast", "viscious-speed": "Viscious Speed", "lord-berandas": "Lord Berandas",
    "irongamer": "Irongamer", "heavenly-dog": "HeavenlyDog", "lucasms": "Lucas", "faithtoken": "Faithtoken",
    "skoll": "Skoll", "andymeneely": "Andy Meneely", "cathelineau": "Cathelineau", "kier-heyl": "Kier Heyl",
    "aussiesim": "Aussiesim", "sparker": "Sparker", "zeromancer": "Zeromancer", "rihlsul": "Rihlsul",
    "catsu": "Catsu", "pierre-leducq": "Pierre Leducq", "caro-asercion": "Caro Asercion", "starseeker": "Starseeker",
    "quoting": "Quoting", "guard13007": "Guard13007", "darkzaitzev": "DarkZaitzev", "spencerdub": "SpencerDub",
    "generalace135": "GeneralAce135", "zajkonur": "Zajkonur", "seregacthtuf": "Seregacthtuf",
    "pepijn-poolman": "Pepijn Poolman", "various-artists": "Various artists", "badges": "Badges"
}


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    icons = json.load(open(sys.argv[1], encoding="utf-8"))["icons"]
    repo = sys.argv[2]
    # versions des sources, notées dans les crédits (traçabilité)
    pkg = os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])), "package.json")
    npm_version = json.load(open(pkg, encoding="utf-8")).get("version", "?") if os.path.exists(pkg) else "?"
    commit = "?"
    git = os.path.join(repo, "..", ".git") if not os.path.isdir(os.path.join(repo, ".git")) else os.path.join(repo, ".git")
    try:
        head = open(os.path.join(git, "HEAD"), encoding="utf-8").read().strip()
        commit = open(os.path.join(git, head[5:]), encoding="utf-8").read().strip() if head.startswith("ref: ") else head
        if not re.fullmatch(r"[0-9a-f]{40}", commit):
            commit = "?"
    except OSError:
        pass
    # auteur de chaque icône : dossier du dépôt qui contient un fichier de ce nom (si un seul)
    owners = {}
    for author in sorted(os.listdir(repo)):
        folder = os.path.join(repo, author)
        if not os.path.isdir(folder) or author.startswith("."):
            continue
        for f in os.listdir(folder):
            if f.endswith(".svg"):
                owners.setdefault(f[:-4], set()).add(author)
    authors, index, rows, skipped = [], {}, [], []
    for name in sorted(icons):
        m = PATH_RE.match(icons[name]["body"])
        if not m:
            skipped.append(name)
            continue
        found = owners.get(name, set())
        a = -1
        if len(found) == 1:
            folder = next(iter(found))
            label = AUTHOR_NAMES.get(folder, folder)
            if label not in index:
                index[label] = len(authors)
                authors.append(label)
            a = index[label]
        rows.append([name, a, m.group(1)])
    head = ("// Icônes de game-icons.net — https://game-icons.net — licence CC BY 3.0 (voir GAME-ICONS-CREDITS.txt).\n"
            "// Fichier produit par tools/make-game-icons.py : ne pas modifier à la main.\n")
    data = json.dumps({"authors": authors, "icons": rows}, ensure_ascii=False, separators=(",", ":"))
    with open(os.path.join(ROOT, "ui", "game-icons.js"), "w", encoding="utf-8") as out:
        out.write(head + "window.VTTDECK_GAME_ICONS = " + data + ";\n")
    credits = [
        "Icônes de la bibliothèque VTT Deck / VTT Deck icon library",
        "",
        "Les icônes proviennent de game-icons.net (https://game-icons.net, https://github.com/game-icons/icons).",
        "Icons come from game-icons.net (https://game-icons.net, https://github.com/game-icons/icons).",
        "",
        "Licence : Creative Commons Attribution 3.0 Unported (CC BY 3.0), https://creativecommons.org/licenses/by/3.0/",
        "Quelques icônes de Viscious Speed sont dans le domaine public (CC0). / A few icons by Viscious Speed are CC0.",
        "Modifications : tracés pris dans le paquet @iconify-json/game-icons (optimisés par Iconify, fond noir retiré) ;",
        "VTT Deck les colore et les met à l'échelle sur les touches.",
        "Changes: paths taken from the @iconify-json/game-icons package (optimised by Iconify, black background removed);",
        "VTT Deck colours and scales them on the keys.",
        "",
        f"Sources : @iconify-json/game-icons {npm_version} ; game-icons/icons, commit {commit[:12]}",
        "",
        "Auteurs / Authors:",
    ] + [f"- {a}" for a in sorted(authors, key=str.lower)] + [""]
    with open(os.path.join(ROOT, "GAME-ICONS-CREDITS.txt"), "w", encoding="utf-8") as out:
        out.write("\n".join(credits))
    size = os.path.getsize(os.path.join(ROOT, "ui", "game-icons.js"))
    unknown = sum(1 for r in rows if r[1] < 0)
    print(f"{len(rows)} icônes, {len(authors)} auteurs, {unknown} sans auteur unique, {len(skipped)} ignorées, {size / 1e6:.1f} Mo")


if __name__ == "__main__":
    main()
