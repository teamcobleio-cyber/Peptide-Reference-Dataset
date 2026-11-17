# Peptide Reference Dataset

> This repository is research done by **[Volta Peptides](https://voltapeptides.com/)**. Every catalogue row links to its product page in the **[Volta Peptides catalogue](https://voltapeptides.com/catalog)**, where the same formula, molecular weight and CAS number are printed beside the vial.

An open, machine-readable reference for research peptides and the small molecules sold beside them: sequences, molecular formulas, average and monoisotopic masses, CAS registry numbers, PubChem and UNII identifiers, and the composition group each compound is filed under. Two tables, each in CSV and JSON:

| File | Rows | One row per |
|---|---|---|
| [`data/compounds.csv`](data/compounds.csv) / [`.json`](data/compounds.json) | 107 | Compound identity (a peptide, protein, metal complex, small molecule or defined mixture) |
| [`data/skus.csv`](data/skus.csv) / [`.json`](data/skus.json) | 90 | Catalogue product (one fill of one compound or blend) |

Of the 107 compounds, 53 carry a primary sequence, 82 a molecular formula, 79 a monoisotopic mass and 93 at least one CAS number. Every CAS number in both tables passes its check digit, and `node scripts/validate.mjs` proves it.

## Quick look

| Compound | Sequence | Formula | Average mass | Monoisotopic mass | CAS | Volta Peptides |
|---|---|---|---|---|---|---|
| BPC-157 | `GEPPPGKPADDAGLV` | C62H98N16O22 | 1419.5 g/mol | 1418.7042 Da | 137525-51-0 | [5mg](https://voltapeptides.com/product/bpc-157-5mg), [10mg](https://voltapeptides.com/product/bpc-157-10mg), [hub](https://voltapeptides.com/peptides/bpc-157) |
| Selank | `TKPRPGP` | C33H57N11O9 | 751.9 g/mol | 751.4341 Da | 129954-34-3 | [10mg](https://voltapeptides.com/product/selank-10mg), [hub](https://voltapeptides.com/peptides/selank) |
| Semax | `MEHFPGP` | C37H51N9O10S | 813.9 g/mol | 813.3480 Da | 80714-61-0 | [10mg](https://voltapeptides.com/product/semax-10mg), [hub](https://voltapeptides.com/peptides/semax) |
| KPV | `KPV` | C16H30N4O4 | 342.43 g/mol | 342.2267 Da | 67727-97-3 | [10mg](https://voltapeptides.com/product/kpv-10mg), [hub](https://voltapeptides.com/peptides/kpv) |
| GHK-Cu | `GHK` + Cu(II) | C14H22CuN6O4 | 401.91 g/mol | 401.0999 Da | 89030-95-5 | [50mg](https://voltapeptides.com/product/ghk-cu-50mg), [100mg](https://voltapeptides.com/product/ghk-cu-100mg), [hub](https://voltapeptides.com/peptides/ghk-cu) |
| GLP-3 RT | acylated 39-mer | C221H342N46O68 | 4731 g/mol | 4728.4718 Da | 2381089-83-2 | [10mg](https://voltapeptides.com/product/glp-3-rt-10mg), [20mg](https://voltapeptides.com/product/glp-3-rt-20mg), [hub](https://voltapeptides.com/peptides/glp-3-rt) |
| Epithalon | `AEDG` | C14H22N4O9 | 390.35 g/mol | 390.1387 Da | 307297-39-8 | [10mg](https://voltapeptides.com/product/epithalon-10mg), [hub](https://voltapeptides.com/peptides/epithalon) |
| MOTS-c | `MRWQEMGYIFYPRKLR` | C101H152N28O22S2 | 2174.6 g/mol | 2173.1077 Da | 1627580-64-6 | [10mg](https://voltapeptides.com/product/mots-c-10mg), [hub](https://voltapeptides.com/peptides/mots-c) |

Browse the catalogue by composition: [peptides](https://voltapeptides.com/catalog?type=peptides), [peptide blends](https://voltapeptides.com/catalog?type=peptide-blends), [copper peptides](https://voltapeptides.com/catalog?type=copper-peptides), [melanotan peptides](https://voltapeptides.com/catalog?type=melanotan-peptides), [bioregulators](https://voltapeptides.com/catalog?type=bioregulators) and [cofactors and small molecules](https://voltapeptides.com/catalog?type=cofactors-small-molecules).

## `compounds` columns

| Column | Meaning |
|---|---|
| `compound_id` | Stable identifier. Blends are named by composition. |
| `name` | Display name. The GLP class is named by research code (GLP-1 SM, GLP-2 TZ, GLP-3 RT). |
| `entity_type` | `peptide`, `protein`, `metal-complex`, `small-molecule`, `defined-mixture`, `solution`, `heterogeneous-preparation` or `unresolved` |
| `chemistry_kind` | `defined` (one molecule), `mixture`, or `unresolved` (identity not settled in the literature) |
| `sequence` | Primary sequence exactly as recorded, in one-letter or three-letter notation, modifications included |
| `sequence_one_letter` | The same sequence in one-letter code, filled only when every residue is one of the twenty standard amino acids. Blank for any modified sequence, on purpose. |
| `residue_count` | Number of residues |
| `modification_count` | Number of recorded modifications (terminal caps, acylation, D-residues, non-standard residues, cyclisation) |
| `formula` / `formula_form` | Molecular formula and the form it describes (free acid, amide, neutral complex, parent before salt) |
| `average_mass` / `average_mass_form` | Average molecular weight as stated by the source, and the form it describes |
| `monoisotopic_mass` | Monoisotopic mass where one is published |
| `cas_registry` | CAS registry number(s) from the compound record, `;`-separated where a salt or second form has its own |
| `pubchem_cid` / `unii` | PubChem compound ID(s) and FDA UNII |
| `composition_group` | The catalogue group the compound is sold under |
| `product_urls` | Space-separated product page URLs, one per fill |
| `hub_url` | The compound's overview page, where one exists |
| `library_url` | The compound's referenced library entry, where it has been published |

## `skus` columns

| Column | Meaning |
|---|---|
| `sku` | Catalogue slug |
| `name` / `fill` | Product name and labelled fill |
| `compound_id` | Join key into `compounds` |
| `composition_group` | Peptides, Peptide Blends, Copper Peptides, Melanotan Peptides, Bioregulators, or Cofactors & Small Molecules |
| `cas` | The CAS cell exactly as the product page prints it. A blend lists each component; a compound with no registry number states why (`Not applicable: peptide hydrolysate`). No number is ever inferred. |
| `formula` / `molecular_weight` | As printed on the product page |
| `purity_specification` | The release specification. It is a threshold, not a measurement of any one lot. |
| `product_url` / `hub_url` / `library_url` | Links back to the source pages |

## Conventions

- **A mass describes a form.** The same peptide is lighter as an amide than as a free acid, heavier as an acetate or hydrochloride salt, and 2.02 Da lighter for each closed disulfide. Read `average_mass_form` before comparing a figure here with a certificate of analysis.
- **Blank means not on file, not zero.** A protein with no published formula, or a mixture with no single mass, is left blank rather than filled with a guess.
- **Formulas are ASCII** (`C62H98N16O22`), with a trailing `+` for a cation.
- **The CSVs are RFC 4180 with CRLF line endings and a UTF-8 byte order mark**, so they open cleanly in Excel. The JSON files carry the same rows.

## Validate

```bash
node scripts/validate.mjs
```

No dependencies. It checks that every CSV row parses to the header's width, that the CSV and JSON agree cell for cell, that every formula is built from real element symbols, that every CAS number passes its check digit, and that every URL is absolute HTTPS.

## Related

- [Peptide Chemistry Toolkit](https://github.com/teamcobleio-cyber/Peptide-Chemistry-Toolkit): compute masses, pI and charge from the sequences in this dataset.
- [3D Amino Acid Peptide Visualizer](https://github.com/teamcobleio-cyber/3D-Amino-Acid-Peptide-Visualizer): 3D structures for many of the same compounds.
- [Peptide Glossary Tool](https://github.com/teamcobleio-cyber/Peptide-Glossary-Tool): the vocabulary used in the column definitions.

## Licence and citation

Data: [CC BY 4.0](LICENSE). Please credit "Volta Peptides, Peptide Reference Dataset" with a link to [voltapeptides.com](https://voltapeptides.com/). `CITATION.cff` carries the citation metadata; GitHub's "Cite this repository" button reads it.

For research use only. Nothing here is medical advice.
