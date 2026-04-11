import yaml

filename = "endings.yaml"
with open(filename, "r") as f:
    data = yaml.safe_load(f)

def inflect(root1, root2, endings):
    tmp = {
            "nom-sg": root1 + endings["nom-sg"],
            "voc-sg": root1 + endings["voc-sg"],
            "acc-sg": root1 + endings["acc-sg"],
            "gen-sg": root2 + endings["gen-sg"],
            "abl-sg": root2 + endings["abl-sg"],
            "dat-sg": root2 + endings["dat-sg"],
            "loc-sg": root2 + endings["loc-sg"],
            "ins-sg": root2 + endings["ins-sg"],
            "nom-pl": root1 + endings["nom-pl"],
            "voc-pl": root1 + endings["voc-pl"],
            "acc-pl": root1 + endings["acc-pl"],
            "gen-pl": root2 + endings["gen-pl"],
            "abl-pl": root2 + endings["abl-pl"],
            "dat-pl": root2 + endings["dat-pl"],
            "loc-pl": root2 + endings["loc-pl"],
            "ins-pl": root2 + endings["ins-pl"],
            }
    return tmp

a = inflect("vir", "vir", data["o_stem_animate_endings"])
print(a)
